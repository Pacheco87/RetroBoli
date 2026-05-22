import React, { useEffect, useMemo, useState } from 'react';
import { Cable, Gamepad2, Joystick, PackageSearch, ShoppingBag } from 'lucide-react';

import {
  apiGet,
  apiRequest,
  clearAdminToken,
  getAdminToken,
  getAssetUrl,
  setAdminToken,
} from './api.js';

const ADMIN_PATH = '/retroboli-admin';
const conditionLabels = ['nuevo', 'muy bueno', 'bueno', 'aceptable', 'necesita revision'];
const statusLabels = ['activo', 'vendido', 'retirado'];
const emptyForm = {
  title: '',
  description: '',
  price: '',
  category: 'Juegos',
  brand: 'Sega',
  platform: 'MegaDrive',
  condition: 'bueno',
  status: 'activo',
  wallapopUrl: '',
  featured: false,
  existingImages: [],
  files: [],
};

export function App() {
  const [route, setRoute] = useState(getRouteFromLocation());

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(nextRoute) {
    window.history.pushState({}, '', nextRouteToPath(nextRoute));
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (route.view === 'admin') {
    return <AdminApp />;
  }

  return <PublicApp navigate={navigate} route={route} />;
}

function PublicApp({ navigate, route }) {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        if (route.view !== 'products' || !route.filter) {
          return true;
        }

        return (
          product.category === route.filter.category &&
          (!route.filter.platform || product.platform === route.filter.platform)
        );
      }),
    [products, route],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const [productsBody, featuredBody, menuBody] = await Promise.all([
          apiGet('/api/products'),
          apiGet('/api/products/featured'),
          apiGet('/api/products/menu'),
        ]);

        if (isMounted) {
          setProducts(productsBody.products);
          setFeaturedProducts(featuredBody.products);
          setMenu(menuBody.menu);
          setError('');
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (route.view !== 'product') {
      setSelectedProduct(null);
      return;
    }

    let isMounted = true;

    async function loadProduct() {
      try {
        setDetailLoading(true);
        const body = await apiGet(`/api/products/${route.productId}`);

        if (isMounted) {
          setSelectedProduct(body.product);
          setError('');
        }
      } catch (loadError) {
        if (isMounted) {
          setSelectedProduct(null);
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setDetailLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [route]);

  return (
    <main className="app-shell">
      <SiteHeader activeView={route.view} menu={menu} navigate={navigate} />
      {route.view === 'product' ? (
        <ProductDetail
          loading={detailLoading}
          product={selectedProduct}
          error={error}
          onBack={() => navigate({ view: 'products' })}
        />
      ) : (
        <>
          {route.view === 'home' && (
            <HomeSection
              featuredProducts={featuredProducts}
              onOpenProduct={(productId) => navigate({ view: 'product', productId })}
              onViewProducts={() => navigate({ view: 'products' })}
            />
          )}
          {route.view === 'products' && (
            <ProductsSection
              activeFilter={route.filter}
              allProductsCount={products.length}
              error={error}
              loading={loading}
              onClearFilter={() => navigate({ view: 'products' })}
              onFilterCategory={(category) =>
                navigate({
                  view: 'products',
                  filter: { category },
                })
              }
              onOpenProduct={(productId) => navigate({ view: 'product', productId })}
              products={visibleProducts}
            />
          )}
        </>
      )}
    </main>
  );
}

function SiteHeader({ activeView, menu, navigate }) {
  return (
    <header className="site-header">
      <button className="brand reset-button" type="button" onClick={() => navigate({ view: 'home' })}>
        <img src="/logo-retroboli.jpg" alt="RetroBoli" />
      </button>
      <nav className="main-nav" aria-label="Navegacion principal">
        <button
          className={activeView === 'home' ? 'active-nav-item' : ''}
          type="button"
          onClick={() => navigate({ view: 'home' })}
        >
          Inicio
        </button>
        <div className="nav-dropdown">
          <button
            className={activeView === 'products' || activeView === 'product' ? 'active-nav-item' : ''}
            type="button"
            onClick={() => navigate({ view: 'products' })}
            aria-haspopup={menu.length > 0 ? 'menu' : undefined}
            aria-expanded={menu.length > 0 ? 'false' : undefined}
          >
            Productos
          </button>
          {menu.length > 0 && (
            <div className="dropdown-panel" role="menu">
              {menu.map((category) => (
                <div className="menu-group" key={category.label}>
                  <div className="menu-group-heading">
                    <CategoryIcon category={category.label} />
                    <strong>{category.label}</strong>
                  </div>
                  <div className="menu-platform-list">
                    {getCategoryPlatforms(category).map((platform) => (
                      <button
                        type="button"
                        key={`${category.label}-${platform}`}
                        onClick={() =>
                          navigate({
                            view: 'products',
                            filter: {
                              category: category.label,
                              platform,
                            },
                          })
                        }
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function HomeSection({ featuredProducts, onOpenProduct, onViewProducts }) {
  return (
    <>
      <section id="inicio" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Retro de segunda mano</p>
          <h1>RetroBoli</h1>
          <p>
            Un escaparate sencillo para encontrar juegos, consolas y piezas retro disponibles, con
            fotos, precio, estado y enlace directo al anuncio de Wallapop.
          </p>
          <button className="hero-action" type="button" onClick={onViewProducts}>
            Ver productos
          </button>
        </div>
      </section>
      <section className="featured-section" aria-labelledby="featured-title">
        <div className="section-heading">
          <p className="eyebrow">Seleccion RetroBoli</p>
          <h2 id="featured-title">Productos destacados</h2>
        </div>
        {featuredProducts.length === 0 ? (
          <StateMessage title="Sin destacados" text="Cuando marques productos como destacados apareceran aqui." />
        ) : (
          <div className="products-grid featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard product={product} key={product.id} onOpen={() => onOpenProduct(product.id)} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ProductsSection({
  activeFilter,
  allProductsCount,
  error,
  loading,
  onClearFilter,
  onFilterCategory,
  products,
  onOpenProduct,
}) {
  const title = activeFilter?.platform || activeFilter?.category || 'Productos en venta';

  return (
    <section id="productos" className="products-section" aria-labelledby="products-title">
      <div className="section-heading">
        <p className="eyebrow">Catalogo activo</p>
        <h2 id="products-title">{title}</h2>
        {activeFilter ? (
          <div className="filter-summary">
            <button
              className="filter-crumb"
              type="button"
              onClick={() => onFilterCategory(activeFilter.category)}
            >
              {activeFilter.category}
            </button>
            {activeFilter.platform && (
              <>
                <span className="filter-separator">/</span>
                <span className="filter-current">{activeFilter.platform}</span>
              </>
            )}
            <button type="button" onClick={onClearFilter}>
              Ver todo
            </button>
          </div>
        ) : (
          <p className="section-copy">{allProductsCount} productos activos disponibles.</p>
        )}
      </div>

      {loading && <StateMessage title="Cargando productos" text="Estamos preparando el catalogo." />}
      {error && <StateMessage title="No se pudo cargar" text={error} />}
      {!loading && !error && products.length === 0 && (
        <StateMessage
          title={activeFilter ? 'Sin productos para este filtro' : 'Sin productos activos'}
          text={activeFilter ? 'Esta plataforma ya no tiene productos activos.' : 'Pronto apareceran nuevos articulos retro.'}
        />
      )}

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} onOpen={() => onOpenProduct(product.id)} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, onOpen }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images?.length ? product.images : [{ url: '/logo-retroboli.jpg', alt: product.title }];
  const image = images[imageIndex] || images[0];

  function showPreviousImage(event) {
    event.stopPropagation();
    setImageIndex((imageIndex - 1 + images.length) % images.length);
  }

  function showNextImage(event) {
    event.stopPropagation();
    setImageIndex((imageIndex + 1) % images.length);
  }

  return (
    <article className="product-card">
      <div className="product-card-shell">
        <div className="product-card-image-frame">
          <button className="product-card-image-button" type="button" onClick={onOpen}>
            <img src={getAssetUrl(image?.url)} alt={image?.alt || product.title} />
          </button>
          {images.length > 1 && (
            <div className="card-carousel-controls" aria-label={`Fotos de ${product.title}`}>
              <button type="button" aria-label="Foto anterior" onClick={showPreviousImage}>
                &lt;
              </button>
              <button type="button" aria-label="Foto siguiente" onClick={showNextImage}>
                &gt;
              </button>
            </div>
          )}
        </div>
        <button className="product-card-body" type="button" onClick={onOpen}>
          <p className="product-meta">
            {product.category} / {product.platform}
          </p>
          <h3>{product.title}</h3>
          <div className="product-card-footer">
            <ConditionBadge condition={product.condition} color={product.conditionColor} />
            <strong>{formatPrice(product.price)}</strong>
          </div>
        </button>
      </div>
    </article>
  );
}

function ProductImageCarousel({ images, title, imageIndex, setImageIndex }) {
  const currentImage = images[imageIndex] || images[0];

  return (
    <div className="carousel">
      <img src={getAssetUrl(currentImage.url)} alt={currentImage.alt || title} />
      {images.length > 1 && (
        <div className="floating-carousel-controls" aria-label={`Fotos de ${title}`}>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}
          >
            &lt;
          </button>
          <span>
            {imageIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => setImageIndex((imageIndex + 1) % images.length)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

function AdminImageCarousel({ images, title, imageIndex, setImageIndex }) {
  const currentImage = images[imageIndex] || images[0];

  return (
    <div className="admin-carousel">
      <img src={currentImage.url} alt={currentImage.alt || title} />
      {images.length > 1 && (
        <div className="floating-carousel-controls" aria-label={`Previsualizacion de ${title || 'producto'}`}>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}
          >
            &lt;
          </button>
          <span>
            {imageIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => setImageIndex((imageIndex + 1) % images.length)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

function ProductDetail({ loading, product, error, onBack }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = product?.images?.length ? product.images : [{ url: '/logo-retroboli.jpg', alt: 'RetroBoli' }];

  useEffect(() => {
    setImageIndex(0);
  }, [product?.id]);

  if (loading) {
    return <StateMessage title="Cargando producto" text="Estamos preparando el detalle." />;
  }

  if (error || !product) {
    return (
      <section className="detail-section">
        <StateMessage title="Producto no encontrado" text={error || 'El producto ya no esta disponible.'} />
        <button className="secondary-button" type="button" onClick={onBack}>
          Volver
        </button>
      </section>
    );
  }

  return (
    <section className="detail-section">
      <button className="secondary-button" type="button" onClick={onBack}>
        Volver al catalogo
      </button>
      <div className="detail-layout">
        <ProductImageCarousel images={images} imageIndex={imageIndex} setImageIndex={setImageIndex} title={product.title} />
        <div className="detail-copy">
          <p className="product-meta">
            {product.category} / {product.brand} / {product.platform}
          </p>
          <h1>{product.title}</h1>
          <strong className="detail-price">{formatPrice(product.price)}</strong>
          <ConditionBadge condition={product.condition} color={product.conditionColor} />
          <p>{product.description}</p>
          <a className="primary-link" href={product.wallapopUrl} target="_blank" rel="noreferrer">
            Comprar en Wallapop
          </a>
        </div>
      </div>
    </section>
  );
}

function AdminApp() {
  const [token, setToken] = useState(getAdminToken());

  return (
    <main className="admin-shell">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Administracion</p>
          <h1>RetroBoli Admin</h1>
        </div>
        {token && (
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              clearAdminToken();
              setToken(null);
            }}
          >
            Cerrar sesion
          </button>
        )}
      </section>
      {token ? <AdminProducts /> : <AdminLogin onLogin={setToken} />}
    </main>
  );
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const body = await apiRequest('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setAdminToken(body.token);
      onLogin(body.token);
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <form className="admin-form compact-form" onSubmit={handleSubmit}>
      <label>
        Usuario
        <input value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <label>
        Contrasena
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" type="submit">
        Entrar
      </button>
    </form>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [openBrands, setOpenBrands] = useState({});
  const [message, setMessage] = useState('');
  const groupedProducts = useMemo(() => groupAdminProducts(products), [products]);

  async function loadProducts() {
    const body = await apiGet('/api/admin/products');
    setProducts(body.products);
  }

  useEffect(() => {
    loadProducts().catch((error) => setMessage(error.message));
  }, []);

  async function closeProduct(product, status) {
    await apiRequest(`/api/admin/products/${product.id}/close`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setMessage(`Producto marcado como ${status}.`);
    setEditingProduct(null);
    await loadProducts();
  }

  function toggleCategory(category) {
    setOpenCategories((current) => ({
      ...current,
      [category]: !current[category],
    }));
  }

  function toggleBrand(category, brand) {
    const key = getAdminGroupKey(category, brand);
    setOpenBrands((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div className="admin-grid">
      <section className="admin-panel">
        <div className="panel-heading">
          <h2>Productos</h2>
          <button className="secondary-button" type="button" onClick={() => setEditingProduct(null)}>
            Nuevo
          </button>
        </div>
        {message && <p className="form-message">{message}</p>}
        <div className="admin-list">
          {groupedProducts.map((categoryGroup) => (
            <section className="admin-category-group" key={categoryGroup.category}>
              <button
                className="admin-group-toggle"
                type="button"
                onClick={() => toggleCategory(categoryGroup.category)}
              >
                <span>{openCategories[categoryGroup.category] ? '−' : '+'}</span>
                <strong>{categoryGroup.category}</strong>
                <small>{categoryGroup.count}</small>
              </button>

              {openCategories[categoryGroup.category] && (
                <div className="admin-brand-list">
                  {categoryGroup.brands.map((brandGroup) => {
                    const brandKey = getAdminGroupKey(categoryGroup.category, brandGroup.brand);

                    return (
                      <section className="admin-brand-group" key={brandKey}>
                        <button
                          className="admin-brand-toggle"
                          type="button"
                          onClick={() => toggleBrand(categoryGroup.category, brandGroup.brand)}
                        >
                          <span>{openBrands[brandKey] ? '−' : '+'}</span>
                          <strong>{brandGroup.brand}</strong>
                          <small>{brandGroup.products.length}</small>
                        </button>

                        {openBrands[brandKey] && (
                          <div className="admin-product-list">
                            {brandGroup.products.map((product) => (
                              <article className="admin-list-item" key={product.id}>
                                <div>
                                  <strong>{product.title}</strong>
                                  <span>
                                    {product.platform} / {formatPrice(product.price)} / {product.status}
                                  </span>
                                </div>
                                <div className="item-actions">
                                  <button type="button" onClick={() => setEditingProduct(product)}>
                                    Editar
                                  </button>
                                  {product.status === 'activo' && (
                                    <>
                                      <button type="button" onClick={() => closeProduct(product, 'vendido')}>
                                        Vendido
                                      </button>
                                      <button type="button" onClick={() => closeProduct(product, 'retirado')}>
                                        Retirado
                                      </button>
                                    </>
                                  )}
                                </div>
                              </article>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      </section>
      <ProductForm
        key={editingProduct?.id || 'new'}
        product={editingProduct}
        onSaved={async () => {
          setMessage(editingProduct ? 'Producto actualizado.' : 'Producto creado.');
          setEditingProduct(null);
          await loadProducts();
        }}
      />
    </div>
  );
}

function groupAdminProducts(products) {
  const categoryMap = new Map();

  products.forEach((product) => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, new Map());
    }

    const brandMap = categoryMap.get(product.category);

    if (!brandMap.has(product.brand)) {
      brandMap.set(product.brand, []);
    }

    brandMap.get(product.brand).push(product);
  });

  return Array.from(categoryMap.entries())
    .sort(([firstCategory], [secondCategory]) => firstCategory.localeCompare(secondCategory, 'es'))
    .map(([category, brandMap]) => {
      const brands = Array.from(brandMap.entries())
        .sort(([firstBrand], [secondBrand]) => firstBrand.localeCompare(secondBrand, 'es'))
        .map(([brand, brandProducts]) => ({
          brand,
          products: brandProducts.sort((firstProduct, secondProduct) =>
            firstProduct.title.localeCompare(secondProduct.title, 'es'),
          ),
        }));

      return {
        category,
        brands,
        count: brands.reduce((total, brandGroup) => total + brandGroup.products.length, 0),
      };
    });
}

function getAdminGroupKey(category, brand) {
  return `${category}::${brand}`;
}

async function optimizeImageFile(file) {
  const maxSize = 1800;
  const quality = 0.92;

  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));

    if (scale === 1) {
      bitmap.close?.();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));

    if (!blob) {
      return file;
    }

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (_error) {
    return file;
  }
}

function ProductForm({ product, onSaved }) {
  const [form, setForm] = useState(() => productToForm(product));
  const [previewIndex, setPreviewIndex] = useState(0);
  const [error, setError] = useState('');
  const previews = useMemo(
    () => [
      ...form.existingImages.map((image) => ({ url: getAssetUrl(image.url), alt: image.alt || form.title })),
      ...form.files.map((file) => ({ url: URL.createObjectURL(file), alt: file.name })),
    ],
    [form.existingImages, form.files, form.title],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function removeExistingImage(index) {
    setForm((current) => ({
      ...current,
      existingImages: current.existingImages.filter((_image, imageIndex) => imageIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const payload = new FormData();
      for (const field of [
        'title',
        'description',
        'price',
        'category',
        'brand',
        'platform',
        'condition',
        'status',
        'wallapopUrl',
      ]) {
        payload.append(field, form[field]);
      }
      payload.append('featured', String(form.featured));
      payload.append('existingImages', JSON.stringify(form.existingImages));
      const optimizedFiles = await Promise.all(form.files.map((file) => optimizeImageFile(file)));
      optimizedFiles.forEach((file) => payload.append('images', file));

      await apiRequest(product ? `/api/admin/products/${product.id}` : '/api/admin/products', {
        method: product ? 'PUT' : 'POST',
        body: payload,
      });

      setForm(emptyForm);
      await onSaved();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{product ? 'Editar producto' : 'Crear producto'}</h2>
      <div className="form-grid">
        <label>
          Titulo
          <input value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
        </label>
        <label>
          Precio
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => updateField('price', event.target.value)}
            required
          />
        </label>
        <label>
          Categoria
          <input value={form.category} onChange={(event) => updateField('category', event.target.value)} required />
        </label>
        <label>
          Marca
          <input value={form.brand} onChange={(event) => updateField('brand', event.target.value)} required />
        </label>
        <label>
          Plataforma
          <input value={form.platform} onChange={(event) => updateField('platform', event.target.value)} required />
        </label>
        <label>
          Condicion
          <select value={form.condition} onChange={(event) => updateField('condition', event.target.value)}>
            {conditionLabels.map((condition) => (
              <option key={condition}>{condition}</option>
            ))}
          </select>
        </label>
        <label>
          Estado
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
            {statusLabels.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Wallapop
          <input
            type="url"
            value={form.wallapopUrl}
            onChange={(event) => updateField('wallapopUrl', event.target.value)}
            required
          />
        </label>
      </div>
      <label>
        Descripcion
        <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
      </label>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => updateField('featured', event.target.checked)}
        />
        Destacado
      </label>
      <label>
        Fotos
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => updateField('files', Array.from(event.target.files))}
        />
      </label>
      {previews.length > 0 && (
        <AdminImageCarousel images={previews} imageIndex={previewIndex} setImageIndex={setPreviewIndex} title={form.title} />
      )}
      {form.existingImages.length > 0 && (
        <div className="image-actions">
          {form.existingImages.map((image, index) => (
            <button type="button" key={image.url} onClick={() => removeExistingImage(index)}>
              Quitar imagen {index + 1}
            </button>
          ))}
        </div>
      )}
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" type="submit">
        Guardar producto
      </button>
    </form>
  );
}

function ConditionBadge({ condition, color }) {
  return <span className={`condition-badge condition-${color || 'lime'}`}>{condition}</span>;
}

function StateMessage({ title, text }) {
  return (
    <div className="state-message">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function productToForm(product) {
  if (!product) {
    return emptyForm;
  }

  return {
    title: product.title,
    description: product.description,
    price: String(product.price),
    category: product.category,
    brand: product.brand,
    platform: product.platform,
    condition: product.condition,
    status: product.status,
    wallapopUrl: product.wallapopUrl,
    featured: product.featured,
    existingImages: product.images || [],
    files: [],
  };
}

function getRouteFromLocation() {
  const { pathname } = window.location;
  const searchParams = new URLSearchParams(window.location.search);

  if (pathname.startsWith(ADMIN_PATH)) {
    return { view: 'admin' };
  }

  const productMatch = pathname.match(/^\/productos\/([^/]+)/);
  if (productMatch) {
    return { view: 'product', productId: productMatch[1] };
  }

  if (pathname === '/productos') {
    const category = searchParams.get('categoria');
    const platform = searchParams.get('plataforma');

    return {
      view: 'products',
      filter: category ? { category, platform: platform || null } : null,
    };
  }

  return { view: 'home' };
}

function nextRouteToPath(route) {
  if (route.view === 'product') {
    return `/productos/${route.productId}`;
  }

  if (route.view === 'products') {
    if (route.filter) {
      const searchParams = new URLSearchParams({
        categoria: route.filter.category,
      });

      if (route.filter.platform) {
        searchParams.set('plataforma', route.filter.platform);
      }

      return `/productos?${searchParams.toString()}`;
    }

    return '/productos';
  }

  return '/';
}

function getCategoryPlatforms(category) {
  const platforms = new Set();

  category.brands.forEach((brand) => {
    brand.platforms.forEach((platform) => {
      platforms.add(platform.label);
    });
  });

  return Array.from(platforms).sort((first, second) => first.localeCompare(second, 'es'));
}

function CategoryIcon({ category }) {
  const normalizedCategory = category.toLowerCase();
  const iconProps = {
    'aria-hidden': true,
    size: 18,
    strokeWidth: 2.3,
  };

  if (normalizedCategory.includes('consola')) {
    return <Joystick {...iconProps} />;
  }

  if (normalizedCategory.includes('juego')) {
    return <Gamepad2 {...iconProps} />;
  }

  if (normalizedCategory.includes('merch')) {
    return <ShoppingBag {...iconProps} />;
  }

  if (normalizedCategory.includes('accesorio')) {
    return <Cable {...iconProps} />;
  }

  return <PackageSearch {...iconProps} />;
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
