# Meetsy: AI Meeting Assistant

Meetsy is a meeting assistant that transcribes, summarizes, extracts actions items from meetings and also makes it all searchable so you don't have to go through the whole meeting again to find that one thing you were looking for.

This repository contains the code for the frontend of the project. The backend can be found [here](https://github.com/nerdimite/meetsy-backend) and the demo can be found [here](https://meetsy.netlify.app).

This is a [Next.js](https://nextjs.org/) project which uses [Tailwind CSS](https://tailwindcss.com/) for styling and [Tremor](tremor.so) for some of the dashboard components.

## Setup

1. Clone the repository
2. Install dependencies using `yarn install`
3. Create a `.env.local` file and add the following environment variables:
    - `NEXT_PUBLIC_WHISPER_API_KEY`: The API key for the CellStrat Whisper API
    - `NEXT_PUBLIC_SEARCH_API_KEY`: The API key for the Transcript Search API that you deployed on CellStrat Hub
4. Run the development server using `yarn next dev`
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is deployed on [Netlify](https://www.netlify.com/). You can deploy it on any other platform of your choice.