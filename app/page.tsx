import StoryGenerator from '@/components/StoryGenerator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 flex flex-col space-y-8 justify-center items-center order-2 lg:order-1 py-16">
          {/* <Image src={} height={250} alt="Logo" /> */}

          <Button asChild className="px-20 bg-purple-700 p-10 text-xl">
            <Link href={'/stories'} className="text-white">
              Explore Story Library
            </Link>
          </Button>
        </div>

        <div className="order-1 lg:order-2 py-4 flex items-center justify-center bg-gray-50">
          <StoryGenerator />
        </div>
      </section>
    </main>
  );
}
