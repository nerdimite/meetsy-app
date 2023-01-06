import { useState } from "react";
import { Button } from "@tremor/react";
import { Title } from "./Utils";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export const UploadVideoButton = ({ setInput, inputId = "uploadVideo" }) => {
  return (
    <div>
      <Button
        importance="secondary"
        text="Upload Video"
        icon={ArrowUpTrayIcon}
        onClick={() => {
          document.getElementById("uploadVideo").click();
        }}
      />
      <input
        id={inputId}
        type="file"
        className="hidden"
        accept="video/*"
        onChange={(event) => {
          let files = event.target.files;
          if (files.length > 0) {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = (e) => {
              let video_uri = e.target.result;
              setInput(video_uri);
            };
          }
        }}
      />
    </div>
  );
};

export const InstructionsComponent = () => {
  return (
    <div className="space-y-2">
      <Title decoration="underline decoration-emerald-500">
        How to use Meetsy
      </Title>

      <div className="text-gray-500 text-sm">
        <ul className="list-decimal list-inside">
          <li>
            <span className="font-mono font-bold">Upload Video</span> of your
            meeting
          </li>
          <li>
            Click on the{" "}
            <span className="font-mono font-bold">Process Video</span> button
          </li>
          <li>Click on the result to jump to the video</li>
        </ul>
      </div>
    </div>
  );
};
