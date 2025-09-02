import Header from '../components/Header/Header'
import Categories from '../components/Categories/Categories';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { currentUser } = useAuth();
  // You can now access the signed-in user's email like this:
  console.log(currentUser?.email);

  return (
    <div className="h-screen bg-orange-50">
        <header>
          <Header prevLocation={'/'} />
        </header>
        <div className="border-coffee bg-camel border-2 m-2">
          <Categories />
        </div>
    </div>
  );
}

export default Home;