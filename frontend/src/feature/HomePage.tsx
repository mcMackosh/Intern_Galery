'use client';

import { motion } from 'framer-motion';
import { Images, Shield, Rocket, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureProps {
    icon: ReactNode;
    title: string;
    text: string;
}

interface RoadmapItemProps {
    phase: string;
    items: string[];
}

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <section className="mx-auto max-w-7xl px-6 pb-24 pt-28 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 text-4xl font-bold leading-tight text-blue-700 md:text-6xl"
                >
                    Smart Gallery Platform
                </motion.h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
                    A modern web platform to create, manage, and explore image galleries.
                    Built with performance, security, and scalability in mind.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/gallery" className="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg">
                        Get Started
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20">
                <h2 className="mb-16 text-center text-3xl font-bold text-gray-900 md:text-4xl">
                    Core Advantages
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                    <Feature
                        icon={<Images className="h-6 w-6" />}
                        title="Flexible Galleries"
                        text="Create structured galleries by events."
                    />
                    <Feature
                        icon={<Shield className="h-6 w-6" />}
                        title="Secure Access"
                        text="Role-based permissions to protect content and manage actions."
                    />
                    <Feature
                        icon={<Rocket className="h-6 w-6" />}
                        title="Modern Stack"
                        text="Built with Next.js, scalable backend architecture, and clean UI."
                    />
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-24">
                <h2 className="mb-16 text-center text-3xl font-bold text-gray-900 md:text-4xl">
                    Product Roadmap
                </h2>
                <div className="space-y-8">
                    <RoadmapItem
                        phase="Phase 1"
                        items={[
                            'Authentication with OAuth (Google, GitHub)',
                            'Public & private galleries',
                            'Mobile-first & responsive UI optimization'
                        ]}
                    />

                    <RoadmapItem
                        phase="Phase 2"
                        items={[
                            'Multiple gallery view modes (grid, masonry, list)',
                            'Built-in image editor (paint, crop, rotate, filters, etc.)',
                            'Advanced role & permission system per gallery',
                        ]}
                    />

                    <RoadmapItem
                        phase="Phase 3"
                        items={[
                            'Advanced analytics & gallery insights',
                            'Google Cloud storage integration',
                        ]}
                    />

                    <RoadmapItem
                        phase="Phase 4"
                        items={[
                            'Photo enhancement with the help of AI',
                            'Smart search using natural language queries (by face, object, color, etc.)',
                            'Duplicate & low-quality image detection',
                        ]}
                    />
                </div>
            </section>
        </main>
    );
}

function Feature({ icon, title, text }: FeatureProps) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg transition-all hover:shadow-xl"
        >
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <div className="text-white">{icon}</div>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600">{text}</p>
        </motion.div>
    );
}

function RoadmapItem({ phase, items }: RoadmapItemProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
            <h3 className="mb-6 text-xl font-semibold text-gray-900">{phase}</h3>
            <ul className="space-y-4">
                {items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-700">{item}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}