<script setup>
import HeaderApp from '../components/layout/HeaderApp.vue';
import FooterApp from '../components/layout/FooterApp.vue';

const steps = [
    { title: '1. Draw any Kanji', desc: 'Simply sketch with your finger or stylus. Our canvas tracks velocity for ultimate accuracy.', icon: 'PenTool' },
    { title: '2. AI Recognition', desc: 'Our custom engine identifies characters instantly, even from imperfect handwriting.', icon: 'Cpu' },
    { title: '3. Deep Context', desc: 'Access dictionary entries, readings, and sentence examples curated for your level.', icon: 'BookOpen' }
];

const progress = { N5: 100, N4: 80, N3: 45, N2: 15 };

</script>

<template>
    <div class="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
        <HeaderApp />
        

        <main>
            <section class="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-12">
                <div class="flex-1 space-y-8">
                    <span
                        class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold tracking-wide">
                        The Precision Inkwell
                    </span>
                    <h1 class="text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
                        Master Kanji, <br />
                        <span class="text-indigo-600 italic">One Stroke</span> <br />
                        at a Time.
                    </h1>
                    <p class="text-xl text-slate-500 max-w-lg leading-relaxed">
                        Experience the art of calligraphy through an advanced digital lens.
                        High-fidelity recognition meets high-end educational design.
                    </p>
                    <div class="flex items-center gap-4">
                        <button @click="$emit('start')"
                            class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                            Get Started
                        </button>
                        <button
                            class="px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                            Watch Film
                        </button>
                    </div>
                </div>

                <div class="flex-1 relative">
                    <div
                        class="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                        <div class="relative w-full h-full opacity-10 blur-[100px] bg-indigo-400"></div>
                        <img src="https://kanjivg.tagaini.net/kanjivg/main/kanji/06728.svg"
                            class="w-64 h-64 opacity-20 absolute" />
                        <div class="relative z-10 text-[200px] font-serif text-indigo-900 drop-shadow-sm">木</div>

                        <div
                            class="absolute top-10 right-10 bg-indigo-600 text-white p-4 rounded-3xl shadow-xl animate-bounce-slow">
                            <div class="text-xs opacity-80 uppercase tracking-widest font-bold mb-1">Result</div>
                            <div class="text-2xl font-bold">木 (Ki)</div>
                            <div class="text-sm opacity-90">Tree • Wood</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-slate-50 py-32">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="mb-16 space-y-4">
                        <h2 class="text-5xl font-bold text-slate-900">The Zen Process</h2>
                        <p class="text-xl text-slate-500 max-w-2xl">
                            Traditional ink, modern intelligence. Our 3-step recognition engine is built for precision
                            and speed.
                        </p>
                    </div>

                    <div class="grid md:grid-cols-3 gap-8">
                        <div v-for="(step, i) in steps" :key="i"
                            class="bg-white p-10 rounded-4xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                            <div
                                class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <component :is="step.icon" class="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 class="text-2xl font-bold mb-4">{{ step.title }}</h3>
                            <p class="text-slate-500 leading-relaxed">{{ step.desc }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-20 items-center">
                <div class="space-y-8">
                    <h2 class="text-5xl font-bold">Full JLPT Mastery</h2>
                    <p class="text-xl text-slate-500">From the basics of N5 to the mastery of N1. KanjiFlow tracks your
                        progress across all proficiency levels.</p>

                    <div class="space-y-6">
                        <div v-for="lvl in ['N5', 'N4', 'N3', 'N2']" :key="lvl" class="space-y-2">
                            <div class="flex justify-between text-sm font-bold text-slate-400">
                                <span>{{ lvl }}</span>
                                <span>{{ progress[lvl] }}%</span>
                            </div>
                            <div class="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-indigo-600 rounded-full" :style="{ width: progress[lvl] + '%' }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm space-y-4 mt-12">
                        <div class="text-4xl font-bold">2,136</div>
                        <div class="text-slate-400 font-bold uppercase text-xs tracking-widest">Joyo Kanji</div>
                    </div>
                    <div class="bg-indigo-600 p-8 rounded-4xl text-white space-y-4">
                        <div class="text-4xl font-bold">150k+</div>
                        <div class="text-indigo-200 font-bold uppercase text-xs tracking-widest">Learners</div>
                    </div>
                    <div class="bg-indigo-500 p-8 rounded-4xl text-white col-span-1">
                        <div class="text-4xl font-bold italic">98.4%</div>
                        <div class="text-indigo-100 text-xs font-bold uppercase mt-2">Accuracy</div>
                    </div>
                    <div class="bg-slate-50 p-8 rounded-4xl space-y-4 border border-slate-200">
                        <div class="text-4xl font-bold">30ms</div>
                        <div class="text-slate-400 font-bold uppercase text-xs tracking-widest">Recognition</div>
                    </div>
                </div>
            </section>

            <section class="max-w-7xl mx-auto px-6 pb-20">
                <div class="bg-indigo-600 rounded-[48px] p-20 text-white relative overflow-hidden group">
                    <div
                        class="absolute -right-20 -bottom-20 text-[500px] font-serif opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        流</div>

                    <div class="relative z-10 max-w-2xl space-y-8">
                        <h2 class="text-6xl font-bold leading-tight">Ready to start your Kanji journey?</h2>
                        <p class="text-xl text-indigo-100 opacity-80">Join thousands of students and professionals
                            mastering the Japanese script with the Precision Inkwell system.</p>
                        <div class="flex gap-4">
                            <button @click="$emit('start')"
                                class="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all">Try
                                the Demo</button>
                            <button
                                class="px-10 py-5 border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">Pricing
                                Plans</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <FooterApp />
    </div>
</template>


<style scoped>
.animate-bounce-slow {
    animation: bounce 3s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(-5%);
    }

    50% {
        transform: translateY(0);
    }
}
</style>