<script setup>
import { Github, Instagram } from 'lucide-vue-next';
</script>

<template>
    <footer class="bg-white border-t border-slate-100 pt-12 pb-8 px-10 mt-auto shrink-0 z-20">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

            <div class="col-span-1 md:col-span-1">
                <h3 class="text-xl font-black text-[#4338CA] mb-4">KanjiFlow</h3>
                <p class="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                    Mastering the art of Kanji through precision recognition and digital ink.
                </p>
                <div class="flex gap-4 text-slate-300">
                    <a href="#" class="hover:text-indigo-500 transition-colors">
                        <Github :size="20" />
                    </a>
                    <a href="#" class="hover:text-indigo-500 transition-colors">
                        <Instagram :size="20" />
                    </a>
                </div>
            </div>

            <div>
                <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-5">Resources</h4>
                <ul class="space-y-3">
                    <li><a href="#"
                            class="text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium">Documentation</a>
                    </li>
                    <li><a href="#"
                            class="text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium">Kanji
                            API</a></li>
                    <li><a href="#"
                            class="text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium">Learning
                            Guides</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-5">Company</h4>
                <ul class="space-y-3">
                    <li><a href="#"
                            class="text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium">About
                            Us</a></li>
                    <li><a href="#"
                            class="text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium">Privacy
                            Policy</a></li>
                </ul>
            </div>

            <div class="flex flex-col justify-end items-end text-right">
                <p class="text-[12px] font-bold text-slate-300 leading-relaxed">
                    © 2026 KanjiFlow by AdityaVisual<br>Built for the modern calligrapher.
                </p>
            </div>

        </div>
    </footer>
</template>