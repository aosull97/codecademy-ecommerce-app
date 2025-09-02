const SocialSignIn = () => {
  
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      <div>
        <a
          href="#"
          className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <img
            className="h-5 w-5"
            src="https://www.svgrepo.com/show/512120/facebook-176.svg"
            alt=""
          />
        </a>
      </div>
      <div>
        <a
          href="#"
          className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <img
            className="h-5 w-5"
            src="https://www.svgrepo.com/show/513008/twitter-154.svg"
            alt=""
          />
        </a>
      </div>
      <div>
        <a
          href="#"
          className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <img
            className="h-6 w-6"
            src="https://www.svgrepo.com/show/506498/google.svg"
            alt=""
          />
        </a>
      </div>
    </div>
  );
};
export default SocialSignIn;
