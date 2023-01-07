import { useState } from "react";
import {
  Block,
  Card,
  ColGrid,
  Tab,
  TabList,
  Button,
  Col,
  TextInput,
} from "@tremor/react";
import {
  ArrowUpTrayIcon,
  BoltIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Header from "../components/Header";
import {
  InstructionsComponent,
  UploadVideoButton,
  TranscriptSegment,
  SearchSegment,
  whisperAPI,
  insightsAPI,
  searchAPI,
} from "../components/Modules";
import { Title, CheckBox } from "../components/Utils";

export default function App() {
  const [selectedView, setSelectedView] = useState(1);
  const [input, setInput] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Uploading video...");



  const processVideo = async () => {
    try {
      // Transcribe the video
      let whisper_output = await whisperAPI({
        video: input.split(",")[1]
      }, setLoadingMessage);
      console.log(whisper_output);
      let transcript = whisper_output.transcript;
      // let transcript = [
      //   {
      //     time: 0.0,
      //     timestamp: "00:00:00.000",
      //     text: " Hello my name is Bhavish.",
      //   },
      // ];

      // Get the summary and action items
      setLoadingMessage("Generating insights...");
      let insights_output = await insightsAPI(transcript);
      console.log(insights_output);

      let _output = {
        transcript: transcript,
        minutes: insights_output.minutes,
        action_items: insights_output.action_items,
      };

      setOutput(_output);
    } catch (err) {
      console.log(err);
      alert("Something went wrong! Please try again.");
    }
  };

  const SummaryTab = () => {
    return (
      <div className="mt-6">
        <Card>
          <Title decoration="underline decoration-purple-500">
            Minutes-of-the-Meeting
          </Title>
          <div className="text-gray-500 text-base">
            <ul className="list-disc list-inside">
              {output &&
                output.minutes.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
            </ul>
          </div>
        </Card>
      </div>
    );
  };

  const ActionItemsTab = () => {
    return (
      <div className="mt-6">
        <Card>
          <Title decoration="underline decoration-red-500">Action Items</Title>

          {output &&
            output.action_items.map((item, index) => {
              return (
                <div key={index} className="flex gap-x-2">
                  <CheckBox label={item} />
                </div>
              );
            })}

          <div className="h-64" />
        </Card>
      </div>
    );
  };

  const InVideoSearchTab = () => {
    return (
      <Block marginTop="mt-6">
        <Card>
          <Title decoration="underline decoration-emerald-500">
            In-Video Search
          </Title>
          <div className="flex gap-x-2 mb-3">
            <TextInput
              icon={MagnifyingGlassIcon}
              placeholder="Search inside the video..."
              id="search-query"
            />
            <Button
              importance="primary"
              text="Search"
              icon={MagnifyingGlassIcon}
              loading={searchLoading}
              disabled={!output}
              onClick={async (e) => {
                e.preventDefault();
                console.log("Making search query");
                let video = document.getElementById("video");
                let query = document.getElementById("search-query").value;
                console.log(query);

                setSearchLoading(true);
                fetch(
                  "https://qiyvjvwm57flqmhhawjq4t4y3u0djofs.lambda-url.us-east-1.on.aws/gradientfire/transcript-search/",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      "x-api-key": "kYkpT5S1o6ajlTsFX6Dl2KElV9zqxJA5jxCNyFZ2",
                    },
                    body: JSON.stringify({
                      transcript: output.transcript,
                      query: query,
                    }),
                  }
                )
                  .then((response) => response.json())
                  .then((data) => {
                    let _results = data.output;
                    console.log("Search Results:", _results);
                    setSearchResults(_results);
                    video.currentTime = _results[0].time;
                    video.play();
                    setSearchLoading(false);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    setSearchLoading(false);
                  });
              }}
            />
          </div>

          {searchResults && (
            <div className="text-md font-medium text-gray-600 mt-10 mb-2">
              Top Search Results
            </div>
          )}
          {searchResults && (
            <div className="space-y-5 p-1">
              {searchResults.map((item, index) => {
                return (
                  <div key={index}>
                    <SearchSegment
                      timestamp={item.timestamp}
                      text={item.text}
                      confidence={item.confidence}
                      onClick={() => {
                        let video = document.getElementById("video");
                        video.currentTime = item.time;
                        video.play();
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </Block>
    );
  };

  const TranscriptTab = () => {
    return (
      <div className="mt-6 h-96 overflow-scroll">
        <Card>
          <Title decoration="underline decoration-pink-500">Transcript</Title>
          {output &&
            output.transcript.map((item, index) => {
              return (
                <div key={index} className="flex gap-x-2">
                  <TranscriptSegment
                    timestamp={item.timestamp}
                    text={item.text}
                    onClick={() => {
                      let video = document.getElementById("video");
                      video.currentTime = item.time;
                      video.play();
                    }}
                  />
                </div>
              );
            })}
        </Card>
      </div>
    );
  };

  const tabSelector = (value) => {
    switch (value) {
      case 1:
        return <SummaryTab />;
      case 2:
        return <ActionItemsTab />;
      case 3:
        return <InVideoSearchTab />;
      case 4:
        return <TranscriptTab />;
      default:
        return <SummaryTab />;
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-screen-lg mx-auto pt-5 pb-10">
        <Block marginTop="mt-6">
          <ColGrid numCols={3} gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
            <Col numColSpan={2}>
              <Card>
                {/* Placeholder to set height */}
                <div>
                  <div className="">
                    <video
                      id="video"
                      controls
                      height="auto"
                      width="100%"
                      className="rounded-lg object-contain"
                      src={input ? input : null}
                    ></video>
                  </div>
                </div>
              </Card>
            </Col>
            <Col numColSpan={1}>
              <div className="relative h-full space-y-5">
                <UploadVideoButton setInput={setInput} />
                <InstructionsComponent />
              </div>
            </Col>
          </ColGrid>
          <div className="flex mt-3 items-center justify-center">
            <Button
              importance="primary"
              size="lg"
              text="Let AI Do It's Magic!"
              loading={loading}
              loadingText={loadingMessage}
              disabled={input === ""}
              icon={BoltIcon}
              onClick={async () => {
                console.log("Processing Video...");
                setLoading(true);
                await processVideo();
                setLoading(false);
              }}
            />
          </div>
        </Block>

        <TabList
          defaultValue={1}
          handleSelect={(value) => setSelectedView(value)}
          marginTop="mt-3"
        >
          <Tab value={1} text="Meeting Summary" />
          <Tab value={2} text="Action Items" />
          <Tab value={3} text="In-Video Search" />
          <Tab value={4} text="Transcript" />
        </TabList>

        {tabSelector(selectedView)}
      </main>
    </>
  );
}
