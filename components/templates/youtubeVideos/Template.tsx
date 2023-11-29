"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLinkPreview } from "@/hooks/useLinkPreview";
import { SectionItem } from "@prisma/client";
import { Edit, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogTemplateProps {
  data: SectionItem;
  onDelete?: () => void;
  onEdit?: () => void;
}

const getlinkpreview = async (url: string) => {
  const reponse = await useLinkPreview(url as string);
  return reponse.data;
};

const YoutubeTemplate: React.FC<BlogTemplateProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [previewdata, setPreviewData] = useState<{ image: string } | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetcheddata = await getlinkpreview(data.url as string);
        setPreviewData(fetcheddata);
      } catch (error) {
        setPreviewData(null);
      }
    };
    fetchData();
  }, [data.url]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  const videoId = (url: string) => {
    const regex =
      /^https?:\/\/(?:www\.)?youtu\.?be(?:\.com)?\/(?:watch\?v=|embed\/|v\/|u\/\w+\/|app\/)?([^#\&\?]*).*/i;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  };
  return (
    <div className="w-[340px] md:w-[550px] h-fit flex items-center justify-center  rounded-md sh relative shadow-[rgba(17,_17,_26,_0.1)_0px_0px_30px] shadow-black">
      {onDelete ? (
        <div className="rounded-md z-20 absolute -top-2 -right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button onClick={onDelete} variant="destructive" size="icon">
                  <Trash className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button onClick={onEdit} variant="secondary" size="icon">
                  <Pencil className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : null}
      {data.url && (
        <iframe
          width="330"
          height="186"
          src={`https://www.youtube.com/embed/${videoId(data.url)}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="rounded-md w-[330px] h-[185px] md:w-[550px] md:h-[310px]"
        ></iframe>
      )}
    </div>
  );
};
export default YoutubeTemplate;