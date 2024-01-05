import { useSignInModal } from "./sign-in-modal";

export const SignInButton = () => {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  return (
    <>
      <SignInModal />
      <button
        className="rounded-full border border-black bg-black p-3 px-4 text-m text-white transition-all hover:bg-white hover:text-black"
        onClick={() => setShowSignInModal(true)}
      >
        Sign In to try the example
      </button>
    </>
  );
};
