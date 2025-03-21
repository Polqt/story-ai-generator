'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { BookOpen, Sparkles } from 'lucide-react';

const storiesPath = 'public/stories';

function StoryGenerator() {
  const [story, setStory] = useState<string>('');
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState();
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState();

  async function runScript() {
    setRunStarted(true)
    setRunFinished(false)

    const response = await fetch('/api/run-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ story, pages, path: storiesPath })
    })

    if (response.ok && response.body) {
      // Handle streams from the API
      console.log('Stream from the API:', response.body)
    } else {
      setRunFinished(true)
      setRunStarted(false)
      console.error('Failed to start the script')
    }
  }

  return (
    <div className="flex flex-col container p-4 md:p-8 h-full">
      <h2 className="text-2xl font-bold mb-6 text-purple-800 flex items-center">
        <BookOpen className="mr-2" size={24} /> Create Your Story
      </h2>
      
      <section className="flex-1 flex flex-col border border-purple-300 rounded-lg shadow-md p-6 md:p-8 space-y-4 bg-white">
        <div className="mb-2">
          <label htmlFor="story-input" className="block text-sm font-medium text-gray-700 mb-1">
            Your Story Idea
          </label>
          <Textarea
            id="story-input"
            value={story}
            onChange={e => setStory(e.target.value)}
            className="flex-1 min-h-32 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            placeholder="Write a story about a brave explorer who discovers a hidden world beneath the ocean..."
          />
        </div>
        
        <div className="mb-2">
          <label htmlFor="pages-select" className="block text-sm font-medium text-gray-700 mb-1">
            Story Length
          </label>
          <Select onValueChange={value => setPages(parseInt(value))}>
            <SelectTrigger id="pages-select" className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
              <SelectValue placeholder="Select number of pages" />
            </SelectTrigger>

            <SelectContent className="w-full">
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {i + 1} {i === 0 ? 'page' : 'pages'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          disabled={!story || !pages || runStarted} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors" 
          size="lg" 
          onClick={runScript}
        >
          <Sparkles className="mr-2" size={18} />
          Generate Story
        </Button>
      </section>

      <section className="flex-1 mt-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Generation Log</h3>
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-900 rounded-lg text-gray-200 font-mono p-4 md:p-6 h-64 overflow-y-auto shadow-inner">
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse mr-5 text-purple-300">
                  Waiting for you to generate a story...
                </p>
                <br />
              </>
            )}
            <span className="mr-3 text-purple-400">{'>>'}</span>
            <span className="text-gray-100">{progress}</span>
          </div>

          {currentTool && (
            <div className="mb-2 border-l-2 border-purple-500 pl-3">
              <span className="mr-3 text-purple-400 font-semibold">{'[Current Tool]'}</span>
              <span className="text-purple-200">{currentTool}</span>
            </div>
          )}

          {runStarted && (
            <div className="mb-2 text-green-300">
              <span className="mr-3 animate-pulse">{'[Process Started]'}</span>
              Generating your story...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StoryGenerator;