"use client";

import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useRef, useState } from "react";

interface MobileBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export default function MobileBottomSheet({
    isOpen,
    onClose,
    children,
    title,
}: MobileBottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const [isDragging, setIsDragging] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        ref={sheetRef}
                        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                        style={{
                            background: "var(--bg-secondary)",
                            borderTop: "1px solid var(--border-glass)",
                            borderRadius: "16px 16px 0 0",
                            maxHeight: "80vh",
                        }}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                        }}
                        drag="y"
                        dragControls={dragControls}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={(_, info) => {
                            setIsDragging(false);
                            if (info.offset.y > 100) {
                                onClose();
                            }
                        }}
                    >
                        {/* Handle */}
                        <div
                            className="pt-3 pb-2 cursor-grab active:cursor-grabbing"
                            onPointerDown={(e) => dragControls.start(e)}
                        >
                            <div className="bottom-sheet-handle" />
                        </div>

                        {title && (
                            <div className="px-5 pb-3 border-b border-border-subtle">
                                <h3 className="text-sm font-medium text-text-primary tracking-wide">
                                    {title}
                                </h3>
                            </div>
                        )}

                        <div
                            className="overflow-y-auto px-5 py-4"
                            style={{
                                maxHeight: "calc(80vh - 60px)",
                                pointerEvents: isDragging ? "none" : "auto",
                            }}
                        >
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
