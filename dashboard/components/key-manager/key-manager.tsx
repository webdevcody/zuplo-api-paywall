import { Icons } from "../../components/ui/icons";
import { useCreateAPIKeyModal } from "./create-key-modal";
import ApiKeyManager, {
  Consumer,
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useTheme } from "next-themes";
import { useCallback, useMemo, useState } from "react";

interface Props {
  apiUrl: string;
  accessToken: string;
}

export function KeyManager({ apiUrl, accessToken }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [showIsLoading, setShowIsLoading] = useState(false);
  const { theme } = useTheme();

  const { CreateAPIKeyModal, setShowCreateAPIKeyModal } =
    useCreateAPIKeyModal();

  const provider = useMemo(() => {
    return new DefaultApiKeyManagerProvider(apiUrl, accessToken);
  }, [apiUrl, accessToken]);

  const createConsumer = useCallback(
    async (description: string) => {
      try {
        setIsCreating(true);

        const response = await fetch(`${apiUrl}/consumers/my`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            description,
          }),
        });

        // TODO - we should have better error handling without alerts, but ok for v1
        if (response.status !== 200) {
          const text = await response.text();
          throw new Error(text);
        }

        provider.refresh();
      } catch (e) {
        console.error(e);
        alert(`Error creating key: ${e}`);
      } finally {
        setIsCreating(false);
        setShowCreateAPIKeyModal(false);
      }
    },
    [provider]
  );

  const deleteConsumer = useCallback(
    async (consumerName: string) => {
      try {
        setShowIsLoading(true);
        await provider.deleteConsumer(consumerName);
        provider.refresh();
      } catch (err) {
        // TODO
        throw err;
      } finally {
        setShowIsLoading(false);
      }
    },
    [provider]
  );

  const menuItems = useMemo(() => {
    return [
      {
        label: "Delete",
        action: async (consumer: Consumer) => {
          await deleteConsumer(consumer.name);
        },
      },
    ];
  }, [deleteConsumer]);

  return (
    <div>
      <ApiKeyManager
        provider={provider}
        menuItems={menuItems}
        showIsLoading={showIsLoading}
        theme={theme === "dark" ? "dark" : "light"}
      />
      <button
        disabled={isCreating}
        onClick={() => setShowCreateAPIKeyModal(true)}
        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg flex flex-row items-center"
      >
        {isCreating ? (
          <>
            <Icons.loadingSpinner />
            Creating...
          </>
        ) : (
          <>
            <CreateAPIKeyModal createConsumer={createConsumer} />
            <>Create new API Key</>
          </>
        )}
      </button>
    </div>
  );
}
