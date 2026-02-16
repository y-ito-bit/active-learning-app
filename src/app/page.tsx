import Link from "next/link";
import { Mic, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 p-6 text-slate-800">
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900">
          Active <span className="text-primary">Learning</span>
        </h1>
        <p className="mb-12 text-xl text-gray-600">
          イベントの学びを深める、リアルタイム対話＆リフレクション
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/organizer"
            className="group relative flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-100"
          >
            <div className="mb-4 rounded-full bg-orange-100 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Mic size={32} />
            </div>
            <h2 className="mb-2 text-2xl font-bold">運営者 (Organizer)</h2>
            <p className="text-gray-500 text-sm">音声認識、問いの生成、結果の分析を行います。</p>
            <ArrowRight className="mt-4 text-gray-300 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/participant"
            className="group relative flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-100"
          >
            <div className="mb-4 rounded-full bg-blue-100 p-4 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
              <Users size={32} />
            </div>
            <h2 className="mb-2 text-2xl font-bold">参加者 (Participant)</h2>
            <p className="text-gray-500 text-sm">問いへの回答、全体傾向の確認、学びの振り返り。</p>
            <ArrowRight className="mt-4 text-gray-300 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
