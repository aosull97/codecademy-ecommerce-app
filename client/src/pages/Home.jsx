import Header from '../components/Header/Header'
import Categories from '../components/Categories/Categories';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';


function Home() {

  const location = useLocation();
  const signedIn = location.state;

  console.log(signedIn)



  return (
    <div className="h-screen bg-orange-50">
        <header>
          <Header signedIn={signedIn} prevLocation={'/'} />
        </header>
        <div className="border-coffee bg-camel border-2 m-2">
          <Categories signedIn={signedIn} />
        </div>
    </div>
  );
}

Home.propTypes = {
  signedIn: PropTypes.bool
  };
export default Home;