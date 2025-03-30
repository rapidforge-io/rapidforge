import { SlInput, SlSwitch, SlTextarea } from "@shoelace-style/shoelace/dist/react";
import { useCanvasItems } from "./App";

export const PageSettings = () => {
  const { pageMetaData, setPageMetadata } = useCanvasItems();

  return (
    <div className="is-flex is-justify-content-space-between is-flex-direction-column">
      <div className="is-flex mb-2 mt-2">
        <SlSwitch
          checked={pageMetaData.active}
          onClick={(e) => setPageMetadata({ ...pageMetaData, active: e.target.checked })}
        >
          Enabled/Disabled
        </SlSwitch>
      </div>
      <div className="mb-2 ml-1 mr-1">
        <SlInput
          label="Page Url"
          id="pageUrl"
          value={pageMetaData.pageUrl}
          onSlInput={(e) => setPageMetadata({ ...pageMetaData, pageUrl: e.target.value })}
        />
      </div>
      <div className="mb-2 ml-1 mr-1">
        <SlInput
          label="Page Title"
          value={pageMetaData.title}
          onSlInput={(e) => setPageMetadata({ ...pageMetaData, title: e.target.value })}
        />
      </div>
      <div className="mb-2 ml-1 mr-1">
        <SlTextarea
          label="Page description"
          value={pageMetaData.description}
          onSlInput={(e) => setPageMetadata({ ...pageMetaData, description: e.target.value })}
        />
      </div>
    </div>
  );
};