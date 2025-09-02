import { useState } from "react";
import Products from "../Products/Products";
import PropTypes from 'prop-types';

const Categories = ({signedIn}) => {

    const [category, setCategory] = useState('All')
    const [allSelected, setAllSelected] = useState(true)
    const [style, setStyle] = useState("block rounded md:bg-transparent md:p-0 hover:text-almond text-almond font-semibold underline decoration-wavy underline-offset-4")

    document.querySelectorAll('a').forEach((e) => {
      e.addEventListener('click', clickAction);
    });
    
    function clickAction(event) {
      const clicked = event.target.innerText;
      console.log(clicked);
    }

    const allClick = (event) => {
      setCategory(event.target.innerText)
      if(allSelected === false) {
        setStyle("block rounded md:bg-transparent md:p-0 focus:text-almond font-semibold focus:font-semibold text-almond underline decoration-wavy underline-offset-4")
      }
    }

    const changeCategory = (event) => {
      setCategory(event.target.innerText)
      setAllSelected(false)
      setStyle("block rounded md:bg-transparent md:p-0 focus:text-almond focus:font-semibold")
    }

    return (
      <div>

      <div className='font-garamond pt-4 pb-2'>
      <nav className="bg-camel">
        <div className="flex flex-wrap items-center justify-between pl-6">
            <ul className="flex flex-col md:p-0 border-2 border-black rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-camel">
              <li>
                <a href="#" onClick={allClick} className={style}>All</a>
              </li>
              <li>
                <a href="#" onClick={changeCategory} className={"block rounded md:hover:text-almond md:p-0 focus:text-almond focus:font-semibold focus:underline decoration-wavy underline-offset-4"}>Bathroom</a>
              </li>
              <li>
                <a href="#" onClick={changeCategory} className="block rounded md:hover:text-almond md:p-0 focus:text-almond focus:font-semibold focus:underline decoration-wavy underline-offset-4">Bedroom</a>
              </li>
              <li>
                <a href="#" onClick={changeCategory} className="block rounded md:hover:text-almond md:p-0 focus:text-almond focus:font-semibold focus:underline decoration-wavy underline-offset-4">Dining Room</a>
              </li>
              <li>
                <a href="#" onClick={changeCategory} className="block rounded md:hover:text-almond md:p-0 focus:text-almond focus:font-semibold focus:underline decoration-wavy underline-offset-4">Kitchen</a>
              </li>
              <li>
                <a href="#" onClick={changeCategory} className="block rounded md:hover:text-almond md:p-0 focus:text-almond focus:font-semibold focus:underline decoration-wavy underline-offset-4">Lighting</a>
              </li>
              <li>
                <a href="#" onClick={changeCategory} className="block rounded md:hover:text-almond md:p-0 focus:text-almond focus:font-semibold focus:underline decoration-wavy underline-offset-4">Living Room</a>
              </li>
              <li>
                <a href="#" onClick={changeCategory} className="block rounded md:hover:text-almond md:p-0 focus:text-almond focus:font-semibold focus:underline decoration-wavy underline-offset-4">Storage</a>
              </li>
            </ul>
          </div>
      </nav>
      </div>
      <Products category={category} signedIn={signedIn} />
      </div>
      
    );
};

Categories.propTypes = {
  signedIn: PropTypes.bool
  };

export default Categories;

