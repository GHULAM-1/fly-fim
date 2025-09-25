import { DocumentActionDescription, DocumentActionProps } from 'sanity'

export function createPublishAction(originalAction: any) {
  return (props: DocumentActionProps): DocumentActionDescription => {
    const { type, draft, published } = props;

    if (type === 'city' && draft) {
      return {
        ...originalAction(props),
        onHandle: async () => {
          // Check for duplicates before publishing
          const cityName = draft.name;
          if (!cityName) {
            alert('City name is required');
            return;
          }

          // Here you could add duplicate checking logic
          // For now, proceed with original publish action
          return originalAction(props).onHandle();
        }
      };
    }

    return originalAction(props);
  };
}