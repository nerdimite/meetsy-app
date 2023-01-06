import { useState } from "react";
import { Button, Card, Badge } from "@tremor/react";
import { Title } from "./Utils";
import {
  ArrowUpTrayIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

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

export const TranscriptSegment = ({ timestamp, text, onClick }) => {
  return (
    <div
      className="flex items-start gap-3 text-gray-700 hover:text-blue-500 cursor-pointer"
      onClick={onClick}
    >
      <div className="font-mono font-medium">{timestamp}</div>
      <div className="text-base">{text}</div>
    </div>
  );
};

export const SearchSegment = ({ timestamp, text, confidence, onClick }) => {
  return (
    <div
      className="space-y-1 text-gray-700 hover:text-blue-500 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <Card>
        <div className="flex items-center justify-between mb-2">
          <Badge
            text={timestamp}
            color="blue"
            size="sm"
            icon={ClockIcon}
            tooltip="Timestamp"
            marginTop="mt-0"
          />
          <Badge
            text={`${confidence.toFixed(2)}`}
            color="green"
            size="sm"
            icon={ArrowTrendingUpIcon}
            tooltip="Search Similarity"
            marginTop="mt-0"
          />
        </div>
        <div className="text-sm">
          {text.length > 250 ? text.substring(0, 250) + "..." : text}
        </div>
      </Card>
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
