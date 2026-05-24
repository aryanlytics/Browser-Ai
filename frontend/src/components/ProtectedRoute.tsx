export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/sign-in");
    }
  }, [loading, user]);

  if (loading) return <PageLoader />;

  if (!user) return null;

  return children;
}