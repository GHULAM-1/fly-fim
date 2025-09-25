export const city = {
  name: 'city',
  title: 'City',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'City Name',
      type: 'string',
      inputComponent: (props: any) => {
        return props.renderDefault({
          ...props,
          onChange: (event: any) => {
            // Auto-format the city name as user types
            const value = event.target.value;
            const formatted = value
              .trim()
              .replace(/[-_]+/g, ' ')        // Convert hyphens/underscores to spaces
              .replace(/\s*&\s*/g, ' & ')    // Normalize & with proper spacing
              .replace(/\s+/g, ' ')          // Remove multiple spaces
              .replace(/[^\w\s&]/g, '')      // Remove special characters except spaces and &
              .toLowerCase()
              .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Title case each word

            props.onChange(formatted);
          }
        });
      },
      validation: (Rule: any) => Rule.required().custom(async (name: string, context: any) => {
        if (!name) return true;

        const { document, getClient } = context;
        const client = getClient({ apiVersion: '2023-12-01' });

        // Normalize the input name for comparison
        const normalizedInputName = name.toLowerCase().trim().replace(/[-_\s]+/g, '');

        // Query for existing cities, excluding the current document
        const query = `*[_type == "city" && _id != $currentId]{name}`;
        const params = { currentId: document._id || 'new' };

        try {
          const existingCities = await client.fetch(query, params);

          // Check if any existing city name matches the normalized input
          const isDuplicate = existingCities.some((city: any) => {
            const normalizedExisting = city.name.toLowerCase().trim().replace(/[-_\s]+/g, '');
            return normalizedExisting === normalizedInputName;
          });

          if (isDuplicate) {
            return `A city with name "${name}" (or similar) already exists. Please use a different name.`;
          }

          return true;
        } catch (error) {
          console.error('Validation error:', error);
          // Allow the validation to pass if there's an error (fallback)
          return true;
        }
      }),
      description: 'The canonical name of the city'
    }
  ],
  preview: {
    select: {
      title: 'name'
    },
    prepare(value: any) {
      const { title } = value
      return {
        title: title || 'Untitled City'
      }
    }
  }
}