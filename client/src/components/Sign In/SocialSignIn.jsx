const SocialSignIn = () => {
  
  return (
    <div className="mt-6">
      <div>
        <a
          href="http://localhost:3000/auth/google"
          className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
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
