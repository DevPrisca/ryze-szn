import "./PageHero.css";

// Reusable page template: the big title banner used at the top of inner pages
function PageHero(props) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg">{props.big}</div>
      <div className="container page-hero-inner">
        <span className="eyebrow">{props.eyebrow}</span>
        <h1>{props.title}</h1>
        <p>{props.text}</p>
      </div>
    </section>
  );
}

export default PageHero;
