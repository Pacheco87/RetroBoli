import React, { useEffect, useMemo, useState } from 'react';

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
  const [menu, setMenu] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const [productsBody, menuBody] = await Promise.all([
          apiGet('/api/products'),
          apiGet('/api/products/menu'),
        ]);

        if (isMounted) {
          setProducts(productsBody.products);
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
      <SiteHeader menu={menu} navigate={navigate} />
      {route.view === 'product' ? (
        <ProductDetail
          loading={detailLoading}
          product={selectedProduct}
          error={error}
          onBack={() => navigate({ view: 'home' })}
        />
      ) : (
        <>
          <HomeSection />
          <ProductsSection
            error={error}
            loading={loading}
            products={products}
            onOpenProduct={(productId) => navigate({ view: 'product', productId })}
          />
        </>
      )}
    </main>
  );
}

function SiteHeader({ menu, navigate }) {
  return (
    <header className="site-header">
      <button className="brand reset-button" type="button" onClick={() => navigate({ view: 'home' })}>
        <img src="/logo-retroboli.jpg" alt="RetroBoli" />
        <span>RetroBoli</span>
      </button>
      <nav className="main-nav" aria-label="Navegacion principal">
        <button type="button" onClick={() => navigate({ view: 'home' })}>
          Inicio
        </button>
        <div className="nav-dropdown">
          <button type="button" onClick={() => document.getElementById('productos')?.scrollIntoView()}>
            Productos
          </button>
          {menu.length > 0 && (
            <div className="dropdown-panel">
              {menu.map((category) => (
                <div className="menu-group" key={category.label}>
                  <strong>{category.label}</strong>
                  {category.brands.map((brand) =>
                    brand.platforms.map((platform) => (
                      <div className="menu-platform" key={`${brand.label}-${platform.label}`}>
                        <span>{platform.label}</span>
                        {platform.products.map((product) => (
                          <button
                            type="button"
                            key={product.id}
                            onClick={() => navigate({ view: 'product', productId: product.id })}
                          >
                            {product.title}
                          </button>
                        ))}
                      </div>
                    )),
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function HomeSection() {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Retro de segunda mano</p>
        <h1>RetroBoli</h1>
        <p>
          Un escaparate sencillo para encontrar juegos, consolas y piezas retro disponibles, con
          fotos, precio, estado y enlace directo al anuncio de Wallapop.
        </p>
      </div>
    </section>
  );
}

function ProductsSection({ error, loading, products, onOpenProduct }) {
  return (
    <section id="productos" className="products-section" aria-labelledby="products-title">
      <div className="section-heading">
        <p className="eyebrow">Catalogo activo</p>
        <h2 id="products-title">Productos en venta</h2>
      </div>

      {loading && <StateMessage title="Cargando productos" text="Estamos preparando el catalogo." />}
      {error && <StateMessage title="No se pudo cargar" text={error} />}
      {!loading && !error && products.length === 0 && (
        <StateMessage title="Sin productos activos" text="Pronto apareceran nuevos articulos retro." />
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
  const image = product.images?.[0];

  return (
    <article className="product-card">
      <button className="product-card-button" type="button" onClick={onOpen}>
        <img src={getAssetUrl(image?.url)} alt={image?.alt || product.title} />
        <div className="product-card-body">
          <div>
            <p className="product-meta">
              {product.category} / {product.platform}
            </p>
            <h3>{product.title}</h3>
          </div>
          <div className="product-card-footer">
            <ConditionBadge condition={product.condition} color={product.conditionColor} />
            <strong>{formatPrice(product.price)}</strong>
          </div>
        </div>
      </button>
    </article>
  );
}

function ProductDetail({ loading, product, error, onBack }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = product?.images?.length ? product.images : [{ url: '/logo-retroboli.jpg', alt: 'RetroBoli' }];
  const currentImage = images[imageIndex] || images[0];

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
        <div className="carousel">
          <img src={getAssetUrl(currentImage.url)} alt={currentImage.alt || product.title} />
          {images.length > 1 && (
            <div className="carousel-controls">
              <button type="button" onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}>
                Anterior
              </button>
              <span>
                {imageIndex + 1} / {images.length}
              </span>
              <button type="button" onClick={() => setImageIndex((imageIndex + 1) % images.length)}>
                Siguiente
              </button>
            </div>
          )}
        </div>
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
  const [message, setMessage] = useState('');

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
          {products.map((product) => (
            <article className="admin-list-item" key={product.id}>
              <div>
                <strong>{product.title}</strong>
                <span>
                  {formatPrice(product.price)} / {product.status}
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
      form.files.forEach((file) => payload.append('images', file));

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

  const currentPreview = previews[previewIndex] || previews[0];

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
      {currentPreview && (
        <div className="admin-carousel">
          <img src={currentPreview.url} alt={currentPreview.alt} />
          <div className="carousel-controls">
            <button
              type="button"
              onClick={() => setPreviewIndex((previewIndex - 1 + previews.length) % previews.length)}
            >
              Anterior
            </button>
            <span>
              {previewIndex + 1} / {previews.length}
            </span>
            <button type="button" onClick={() => setPreviewIndex((previewIndex + 1) % previews.length)}>
              Siguiente
            </button>
          </div>
        </div>
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

  if (pathname.startsWith(ADMIN_PATH)) {
    return { view: 'admin' };
  }

  const productMatch = pathname.match(/^\/productos\/([^/]+)/);
  if (productMatch) {
    return { view: 'product', productId: productMatch[1] };
  }

  return { view: 'home' };
}

function nextRouteToPath(route) {
  if (route.view === 'product') {
    return `/productos/${route.productId}`;
  }

  return '/';
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
