export const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy: ", error);
      alert("Failed to copy. Please try again.");
    }
  };
  