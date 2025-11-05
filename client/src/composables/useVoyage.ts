import { ref } from "vue";

export default function useVoyage() {

  const isLoadingVoyageData = ref(true)

  const fetchVoyageData = async () => {
    try {
      const response = await fetch("http://localhost:8000/voyages");
      if (!response.ok) {
        isLoadingVoyageData.value = false
        return { success: false, data: [] };
      }

      const data = await response.json();
      isLoadingVoyageData.value = false
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching voyages:", error);
      isLoadingVoyageData.value = false
      return { success: false, data: [] };
    }
  };

  return {
    fetchVoyageData,
    isLoadingVoyageData
  };
}
