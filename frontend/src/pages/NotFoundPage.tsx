import { Link } from "react-router-dom";
export default function NotFoundPage(){return <div className="not-found"><div className="not-found-code">404</div><h1>Page not found</h1><p>The page you’re looking for doesn’t exist or has moved.</p><Link className="primary-button" to="/">Back to dashboard</Link></div>}
