import { useState } from "react";
import { Button, Card, Badge } from "@tremor/react";
import { Title } from "./Utils";
import {
  ArrowUpTrayIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

const API_KEY = "uH4mo8miig9mueJgbxsRa7pN0nryEXPb6gJTpBuL";

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
            <span className="font-mono font-bold">Upload Video</span> of
            your meeting
          </li>
          <li>
            Click on the <span className="font-mono font-bold">Big Blue Button Below</span>{" "}
            button
          </li>
          <li>The results will be displayed in the tab group below.</li>
          <li>
            The <span className="font-mono font-bold">Meeting Summary</span> tab will
            show the minutes of the meeting.
          </li>
          <li>
            The <span className="font-mono font-bold">Action Items</span> tab
            will show the action items of the meeting.
          </li>
          <li>
            The <span className="font-mono font-bold">Search</span> tab can be
            used to search the video in natural language. The search results are
            sorted by the similarity of the search query to the transcript.
          </li>
          <li>
            The <span className="font-mono font-bold">Transcript</span> tab will
            show the transcript of the meeting. Every timestamp can be clicked
            to jump to that part of the video.
          </li>
        </ul>
      </div>
    </div>
  );
};

// Inference Functions
export const whisperAPI = async (payload, setLoadingMessage) => {
  console.log("Payload:", payload);

  // Get S3 Upload URL from API
  setLoadingMessage("Uploading video...");
  const raw_upload_resp = await fetch(
    `https://qiyvjvwm57flqmhhawjq4t4y3u0djofs.lambda-url.us-east-1.on.aws/input`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
      method: "GET",
    }
  );
  const upload_response = await raw_upload_resp.json();
  console.log("Presigned S3 URL:", upload_response);

  // Upload to S3 (PUT)
  const raw_upload = await fetch(upload_response.presigned_url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "PUT",
    body: JSON.stringify(payload),
  });
  console.log("Video Upload Status:", raw_upload.status);

  // Make Inference Request on Uploaded File (GET)
  setLoadingMessage("Transcribing video...");
  const raw_response = await fetch(
    `https://qiyvjvwm57flqmhhawjq4t4y3u0djofs.lambda-url.us-east-1.on.aws/cellstrat/whisper-gpu/${upload_response.invocation_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
      method: "GET",
    }
  );
  const response = await raw_response.json();

  return response.output;
};

export const insightsAPI = async (transcript) => {
  // Make POST Request to API
  const raw_response = await fetch(
    "https://cn7lpguukasl5z6wnvt7m6p2mi0lbmzm.lambda-url.us-east-1.on.aws/",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({ transcript: transcript }),
    }
  );
  const response = await raw_response.json();

  return response;
};

export const searchAPI = async (transcript, query) => {
  // Make POST Request to API
  const raw_response = await fetch(
    "https://qiyvjvwm57flqmhhawjq4t4y3u0djofs.lambda-url.us-east-1.on.aws/gradientfire/transcript-search/",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
      method: "POST",
      body: JSON.stringify({ transcript: transcript, query: query }),
    }
  );
  const response = await raw_response.json();

  return response;
};
