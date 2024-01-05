import Modal from "@/components/ui/modal";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

export const CreateAPIKeyModal = ({
  showCreateAPIKeyModal,
  setShowCreateAPIKeyModal,
  createConsumer,
}: {
  showCreateAPIKeyModal: boolean;
  setShowCreateAPIKeyModal: Dispatch<SetStateAction<boolean>>;
  createConsumer: (description: string) => Promise<void>;
}) => {
  const [description, setDescription] = useState("");

  return (
    <Modal
      showModal={showCreateAPIKeyModal}
      setShowModal={setShowCreateAPIKeyModal}
    >
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-display text-xl text-black font-bold">
            Description
          </h3>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-500 focus:outline-none focus:border-gray-300"
            placeholder="Your API Key description"
          />
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <button
            className="border border-gray-200 bg-white text-black hover:bg-gray-50 flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none"
            onClick={() => {
              createConsumer(description);
            }}
          >
            Create API Key
          </button>
        </div>
      </div>
    </Modal>
  );
};

export function useCreateAPIKeyModal() {
  const [showCreateAPIModal, setShowCreateAPIKeyModal] = useState(false);

  const CreateAPIKeyModalCallback = useCallback(
    ({
      createConsumer,
    }: {
      createConsumer: (description: string) => Promise<void>;
    }) => {
      return (
        <CreateAPIKeyModal
          showCreateAPIKeyModal={showCreateAPIModal}
          setShowCreateAPIKeyModal={setShowCreateAPIKeyModal}
          createConsumer={createConsumer}
        />
      );
    },
    [showCreateAPIModal, setShowCreateAPIKeyModal]
  );

  return useMemo(
    () => ({
      setShowCreateAPIKeyModal,
      CreateAPIKeyModal: CreateAPIKeyModalCallback,
    }),
    [setShowCreateAPIKeyModal, CreateAPIKeyModalCallback]
  );
}
