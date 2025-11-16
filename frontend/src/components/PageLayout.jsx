function PageLayout ({ title, description, actions, children }) {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Stage 5 Prototype</p>
          <h1>{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && (
          <div className="page-actions">
            {actions}
          </div>
        )}
      </div>
      <div className="page-content">
        {children}
      </div>
    </section>
  );
}

export default PageLayout;
