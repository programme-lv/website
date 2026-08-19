"use client";

import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconChevronLeft, IconFolderOpen, IconSend, IconX } from "@tabler/icons-react";
import { ListBox, Select, cn } from "@heroui/react";
import MonacoEditor from "@monaco-editor/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AuthContext } from "@/app/providers";
import Button from "@/components/ui/button";
import { listProgrammingLanguages } from "@/lib/langs";
import { createSubmission } from "@/lib/subms";
import { ProgrammingLanguage } from "@/types/proglv";
import { DetailedSubmView } from "@/types/subm";

import SubmitProgress from "./submit-progress";

type TaskEditorProps = {
	taskCode: string;
	onClose?: () => void;
	backHref?: string;
};

export default function TaskEditor({ taskCode, onClose, backHref }: TaskEditorProps) {
	const authContext = useContext(AuthContext);
	const queryClient = useQueryClient();
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [resultSubm, setResultSubm] = useState<DetailedSubmView | null>(null);
	const [evalRunning, setEvalRunning] = useState(false);
	const [code, setCode] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const skipLangLoadRef = useRef(false);

	const { data: listLangsResponse } = useQuery({
		queryKey: ["list-languages"],
		queryFn: listProgrammingLanguages,
	});

	const languages = listLangsResponse?.data;

	useEffect(() => {
		if (!languages) return;
		if (selectedLanguage !== "") return;

		const savedLang = sessionStorage.getItem(`lang-${taskCode}`);
		const savedOk = languages.some((lang) => lang.id === savedLang && lang.enabled);
		if (savedLang && savedOk) {
			setSelectedLanguage(savedLang);
			return;
		}

		const defaultLang = languages.find((lang) => lang.id === "cpp17");
		setSelectedLanguage(defaultLang ? "cpp17" : languages[0].id);
	}, [languages, selectedLanguage, taskCode]);

	useEffect(() => {
		if (!selectedLanguage) return;
		sessionStorage.setItem(`lang-${taskCode}`, selectedLanguage);
	}, [selectedLanguage, taskCode]);

	const monacoLangId =
		languages?.find((lang) => lang.id === selectedLanguage)?.monacoId || "";

	useEffect(() => {
		if (skipLangLoadRef.current) {
			skipLangLoadRef.current = false;
			return;
		}
		const savedText = sessionStorage.getItem(
			`code-${taskCode}-${selectedLanguage}`,
		);

		if (savedText) {
			setCode(savedText);
		} else if (selectedLanguage === "cpp17") {
			setCode(`#include <iostream>
using namespace std;

int main() {
		
}`);
		}
	}, [selectedLanguage, taskCode]);

	useEffect(() => {
		sessionStorage.setItem(`code-${taskCode}-${selectedLanguage}`, code);
	}, [code, selectedLanguage, taskCode]);

	const submitSolution = async () => {
		setIsLoading(true);
		try {
			const created = await createSubmission(
				code,
				authContext.user?.username ?? "",
				selectedLanguage,
				taskCode,
			);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["submissions"] }),
				queryClient.invalidateQueries({ queryKey: ["userScores"] }),
			]);
			setResultSubm(created);
			setEvalRunning(true);
		} catch (error: unknown) {
			if (error && typeof error === "object" && "response" in error) {
				const errorWithResponse = error as { response?: { data?: { message?: string } } };
				const data = errorWithResponse.response?.data;
				if (data && typeof data === "object" && "message" in data) {
					alert(data.message);
				} else {
					alert("Kļūda iesūtot risinājumu. Lūdzu, mēģiniet vēlreiz!");
				}
			} else {
				alert("Kļūda iesūtot risinājumu. Lūdzu, mēģiniet vēlreiz!");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const submitBusy = isLoading || evalRunning;

	const openPickedFile = async (file: File) => {
		const text = await file.text();
		const guessed = guessLanguageId(file.name, languages);
		if (guessed && guessed !== selectedLanguage) {
			skipLangLoadRef.current = true;
			setSelectedLanguage(guessed);
		}
		setCode(text);
	};

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-divider px-3 py-2">
				<div className="flex min-w-0 items-center gap-1">
					{backHref && (
						<Link
							aria-label="Atpakaļ pie uzdevuma"
							className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-default-700 hover:bg-gray-100"
							href={backHref}
						>
							<IconChevronLeft size={20} aria-hidden />
						</Link>
					)}
					<p className="truncate text-sm font-medium">Iesūtīt risinājumu</p>
				</div>
				<div className="flex flex-wrap items-center justify-end gap-2">
					<LanguageSelect
						languages={languages}
						selectedLanguage={selectedLanguage}
						setSelectedLanguage={setSelectedLanguage}
					/>
					{authContext.user ? (
						<Button
							icon={<IconSend size={16} aria-hidden />}
							isDisabled={submitBusy}
							isLoading={submitBusy}
							size="sm"
							type="button"
							variant="success"
							onClick={() => void submitSolution()}
						>
							Iesūtīt
						</Button>
					) : (
						<Button isDisabled size="sm" type="button" variant="primary">
							Pieslēdzies, lai iesūtītu
						</Button>
					)}
					{/* {onClose && (
						<button
							aria-label="Aizvērt"
							className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-default-700 hover:bg-gray-100"
							onClick={onClose}
							type="button"
						>
							<IconX size={18} aria-hidden />
						</button>
					)} */}
				</div>
			</div>
			{resultSubm && (
				<SubmitProgress
					key={resultSubm.subm_uuid}
					subm={resultSubm}
					onClose={() => {
						setResultSubm(null);
						setEvalRunning(false);
					}}
					onRunningChange={setEvalRunning}
				/>
			)}
			<div className="relative min-h-0 flex-1">
				<div className="absolute inset-0">
					<MonacoEditor
						language={monacoLangId}
						options={{
							minimap: { enabled: false },
							fontSize: 14,
						}}
						theme="vs-dark"
						value={code}
						onChange={(value: string | undefined) => setCode(value || "")}
					/>
				</div>
			</div>
			<div className="flex shrink-0 items-center border-t border-divider px-3 py-2">
				<input
					ref={fileInputRef}
					accept=".c,.cc,.cpp,.cxx,.c++,.cs,.go,.java,.js,.kt,.mjs,.pas,.php,.pp,.py,.py3,.rb,.rs"
					className="hidden"
					type="file"
					onChange={(event) => {
						const file = event.target.files?.[0];
						event.target.value = "";
						if (file) void openPickedFile(file);
					}}
				/>
				<Button
					icon={<IconFolderOpen size={16} aria-hidden />}
					iconPosition="start"
					size="sm"
					type="button"
					variant="default"
					onClick={() => fileInputRef.current?.click()}
				>
					Atvērt failu
				</Button>
			</div>
		</div>
	);
}

const EXT_FAMILY: Record<string, string> = {
	cpp: "cpp",
	cc: "cpp",
	cxx: "cpp",
	"c++": "cpp",
	c: "c",
	py: "python",
	py3: "python",
	java: "java",
	js: "javascript",
	mjs: "javascript",
	kt: "kotlin",
	rs: "rust",
	go: "go",
	cs: "csharp",
	php: "php",
	rb: "ruby",
	pas: "pascal",
	pp: "pascal",
};

const FAMILY_MATCH: Record<string, (id: string) => boolean> = {
	cpp: (id) => id === "cpp" || id.startsWith("cpp"),
	c: (id) => /^c(\d+)?$/.test(id),
	python: (id) => id.startsWith("python"),
	java: (id) => id.startsWith("java"),
	javascript: (id) =>
		id.startsWith("javascript") || id.startsWith("node") || id === "js",
	kotlin: (id) => id.startsWith("kotlin") || id.startsWith("kt"),
	rust: (id) => id.startsWith("rust") || id === "rs",
	go: (id) => id === "go" || /^go[\d.]/.test(id),
	csharp: (id) => id.startsWith("csharp") || id.startsWith("cs"),
	php: (id) => id.startsWith("php"),
	ruby: (id) => id.startsWith("ruby") || id.startsWith("rb"),
	pascal: (id) =>
		id.startsWith("pascal") || id.startsWith("fpc") || id.startsWith("freepascal"),
};

function guessLanguageId(
	filename: string,
	languages: ProgrammingLanguage[] | undefined | null,
): string | undefined {
	if (!languages?.length) {
		return undefined;
	}
	const dot = filename.lastIndexOf(".");
	if (dot < 0) {
		return undefined;
	}
	const family = EXT_FAMILY[filename.slice(dot + 1).toLowerCase()];
	const matchesFamily = family ? FAMILY_MATCH[family] : undefined;
	if (!family || !matchesFamily) {
		return undefined;
	}
	const matches = languages.filter((lang) => lang.enabled && matchesFamily(lang.id));
	return matches.at(-1)?.id;
}

type LanguageSelectProps = {
	languages: ProgrammingLanguage[] | undefined | null;
	selectedLanguage: string;
	setSelectedLanguage: Dispatch<SetStateAction<string>>;
};

function LanguageSelect({
	languages,
	selectedLanguage,
	setSelectedLanguage,
}: LanguageSelectProps) {
	if (!languages?.length) {
		return null;
	}

	const disabledKeys = new Set(
		languages.filter((lang) => !lang.enabled).map((lang) => lang.id),
	);

	const sorted = [...languages].sort((a, b) => {
		const aDis = disabledKeys.has(a.id);
		const bDis = disabledKeys.has(b.id);
		if (aDis && !bDis) return 1;
		if (!aDis && bDis) return -1;
		return a.fullName.localeCompare(b.fullName);
	});

	const selectedKey =
		selectedLanguage ||
		sorted.find((l) => l.enabled)?.id ||
		sorted[0]?.id;

	return (
		<Select
			className="w-40 max-w-48"
			selectedKey={selectedKey}
			variant="secondary"
			onSelectionChange={(key) => {
				if (key !== null) setSelectedLanguage(String(key));
			}}
		>
			<Select.Trigger
				className={cn(
					"h-8 min-h-8 w-full justify-between gap-2 rounded-sm px-3 text-sm font-normal",
				)}
			>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover className="overflow-hidden rounded-sm">
				<ListBox className="rounded-sm">
					{sorted.map((lang) => (
						<ListBox.Item
							key={lang.id}
							id={lang.id}
							isDisabled={!lang.enabled}
							textValue={lang.fullName}
						>
							{lang.fullName}
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	);
}
