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
} from "../components/Modules";
import { Title, CheckBox } from "../components/Utils";

export default function App() {
  const [selectedView, setSelectedView] = useState(1);
  const [input, setInput] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [query, setQuery] = useState(null);
  const [seek, setSeek] = useState(0);

  const SummaryTab = () => {
    return (
      <ColGrid numCols={1} gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
        <Card>
          <Title decoration="underline decoration-purple-500">
            Minutes-of-the-Meeting
          </Title>
          <div className="h-64" />
        </Card>
      </ColGrid>
    );
  };

  const ActionItemsTab = () => {
    return (
      <Block marginTop="mt-6">
        <Card>
          <Title decoration="underline decoration-red-500">Action Items</Title>

          <CheckBox label="Create a new landing page for the home page of the platform" />
          <CheckBox label="Item 2" />

          <div className="h-64" />
        </Card>
      </Block>
    );
  };

  const InVideoSearchTab = () => {
    return (
      <Block marginTop="mt-6">
        <Card>
          <Title decoration="underline decoration-emerald-500">
            In-Video Search
          </Title>
          <div className="flex gap-x-2">
            <TextInput
              icon={MagnifyingGlassIcon}
              placeholder="Search inside the video..."
            />
            <Button
              importance="primary"
              text="Search"
              icon={MagnifyingGlassIcon}
            />
          </div>
          <div className="h-64" />
        </Card>
      </Block>
    );
  };

  const TranscriptTab = () => {
    return (
      <Block marginTop="mt-6">
        <Card>
          <Title decoration="underline decoration-Fuchsia-500">
            Transcript
          </Title>
          <div className="h-64" />
        </Card>
      </Block>
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

                <div className="absolute bottom-0 left-0">
                  <Button
                    importance="primary"
                    size="lg"
                    text="Process Video"
                    icon={BoltIcon}
                    onClick={() => {
                      console.log("Processing Video...");
                    }}
                  />
                </div>
              </div>
            </Col>
          </ColGrid>
        </Block>

        <TabList
          defaultValue={1}
          handleSelect={(value) => setSelectedView(value)}
          marginTop="mt-6"
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
