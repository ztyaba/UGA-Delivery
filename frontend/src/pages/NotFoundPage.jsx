import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';

function NotFoundPage () {
  return (
    <PageLayout title="Page not found" description="The route you requested is not part of the Stage 5 prototype yet.">
      <p>Use the navigation above or return to the customer home experience.</p>
      <Link className="button" to="/">Go Home</Link>
    </PageLayout>
  );
}

export default NotFoundPage;
