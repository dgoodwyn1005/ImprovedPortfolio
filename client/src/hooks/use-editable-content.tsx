import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PageContent } from "@shared/schema";

interface EditableContent {
  [key: string]: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    isVisible?: boolean;
  };
}

export function useEditableContent(page: string, section?: string) {
  const { data: pageContents = [], isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/page-content", page, section],
    queryFn: async () => {
      const url = section 
        ? `/api/page-content?page=${page}&section=${section}`
        : `/api/page-content?page=${page}`;
      return apiRequest(url, "GET");
    },
  });

  // Transform the data into a more usable format
  const content: EditableContent = {};
  
  pageContents.forEach((item) => {
    if (!content[item.contentKey]) {
      content[item.contentKey] = {};
    }
    
    if (item.title !== null) content[item.contentKey].title = item.title;
    if (item.subtitle !== null) content[item.contentKey].subtitle = item.subtitle;
    if (item.description !== null) content[item.contentKey].description = item.description;
    if (item.buttonText !== null) content[item.contentKey].buttonText = item.buttonText;
    if (item.buttonLink !== null) content[item.contentKey].buttonLink = item.buttonLink;
    if (item.isVisible !== null) content[item.contentKey].isVisible = item.isVisible;
  });

  return {
    content,
    isLoading,
    rawContent: pageContents,
  };
}

export function useEditableContentByKey(page: string, section: string, contentKey: string) {
  const { content, isLoading } = useEditableContent(page, section);
  
  return {
    content: content[contentKey] || {},
    isLoading,
  };
}
