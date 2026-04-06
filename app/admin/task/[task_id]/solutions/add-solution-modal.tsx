"use client";
import React, { useState, useEffect } from "react";
import { Input, Textarea } from "@heroui/react";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import FileUpload from "@/components/file-upload";
import { listProgrammingLanguages } from "@/lib/langs";
import { useQuery } from "@tanstack/react-query";
import GenericButton from "@/components/generic-button";

interface AddSolutionModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	onSolutionAdded: (solution: SolutionFormData) => void;
}

export interface SolutionFormData {
	filename: string;
	programmingLanguage: string;
	content: string;
	author: string;
	expectedResult: string;
}

const extensionToLanguage: Record<string, string> = {
	'.py': 'python311',
	'.cpp': 'cpp17',
};

export default function AddSolutionModal({ isOpen, onOpenChange, onSolutionAdded }: AddSolutionModalProps) {
	const [formData, setFormData] = useState<SolutionFormData>({
		filename: '',
		programmingLanguage: '',
		content: '',
		author: '',
		expectedResult: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: listLangsResponse } = useQuery({
		queryKey: ["list-languages"],
		queryFn: listProgrammingLanguages
	});

	const languages = listLangsResponse?.data;

	useEffect(() => {
		if (languages && !formData.programmingLanguage) {
			const defaultLang = languages.find((lang) => lang.id === "cpp17" && lang.enabled);
			if (defaultLang) {
				setFormData(prev => ({ ...prev, programmingLanguage: defaultLang.id }));
			} else {
				const firstEnabled = languages.find(lang => lang.enabled);
				if (firstEnabled) {
					setFormData(prev => ({ ...prev, programmingLanguage: firstEnabled.id }));
				}
			}
		}
	}, [languages, formData.programmingLanguage]);

	const detectLanguageFromExtension = (filename: string): string => {
		const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
		const detectedLangId = extensionToLanguage[ext];

		if (detectedLangId && languages) {
			const lang = languages.find(l => l.id === detectedLangId && l.enabled);
			return lang ? lang.id : formData.programmingLanguage;
		}

		return formData.programmingLanguage;
	};

	const handleFileSelect = async (file: File) => {
		try {
			const content = await file.text();
			const detectedLanguage = detectLanguageFromExtension(file.name);

			setFormData(prev => ({
				...prev,
				filename: file.name,
				content: content,
				programmingLanguage: detectedLanguage
			}));
		} catch (error) {
			console.error('Error reading file:', error);
			alert('Kļūda nolasot failu. Lūdzu, mēģiniet vēlreiz.');
		}
	};

	const handleSubmit = async () => {
		const requiredFields: Array<[keyof typeof formData, string]> = [
			['filename', 'faila nosaukumu'],
			['programmingLanguage', 'programmēšanas valodu'],
			['content', 'kodu'], 
			['expectedResult', 'sagaidāmo rezultātu'],
		];
		for (const [field, label] of requiredFields) {
			if (!formData[field]?.trim()) {
				alert(`Lūdzu, ievadiet ${label}.`);
				return;
			}
		}

		setIsSubmitting(true);

		try {
			onSolutionAdded(formData);
			setFormData({
				filename: '',
				programmingLanguage: languages?.find(l => l.id === "cpp17" && l.enabled)?.id || languages?.find(l => l.enabled)?.id || '',
				content: '',
				author: '',
				expectedResult: ''
			});
			onOpenChange();
		} catch (error) {
			console.error('Error adding solution:', error);
			alert('Kļūda pievienojot risinājumu. Lūdzu, mēģiniet vēlreiz.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!isSubmitting) {
			onOpenChange();
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={handleClose}>
			<div className="w-full max-w-3xl rounded-md bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
				<div className="border-b border-divider px-6 py-3 text-lg font-semibold">
					Pievienot risinājumu
				</div>

				<div className="max-h-[80vh] overflow-y-auto p-6">
					<div className="flex flex-col gap-4">
						<FileUpload onFileSelect={handleFileSelect} acceptedTypes=".py,.cpp"
							variant="secondary" size="sm" icon={<IconUpload size={16} />}>
							Izvēlēties risinājuma failu
						</FileUpload>

						<Input
							label="Faila nosaukums"
							placeholder="piemēram, solution1.py"
							value={formData.filename}
							onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))}
							size="sm"
							isRequired
						/>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Programmēšanas valoda</label>
							<select
								className="rounded-sm border border-divider bg-white px-3 py-2 text-sm"
								value={formData.programmingLanguage}
								onChange={(e) => setFormData(prev => ({ ...prev, programmingLanguage: e.target.value }))}
							>
								{languages?.filter((lang) => lang.enabled).map((item) => (
									<option key={item.id} value={item.id}>
										{item.fullName}
									</option>
								))}
							</select>
						</div>

						<Input
							label="Autors"
							placeholder="Risinājuma autora vārds, uzvārds"
							value={formData.author}
							onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
							size="sm"
						/>

						<Input
							label="Sagaidāmais rezultāts"
							placeholder="piemēram: 100/100 @ 1.00s & 256 MiB"
							value={formData.expectedResult}
							onChange={(e) => setFormData(prev => ({ ...prev, expectedResult: e.target.value }))}
							size="sm"
							isRequired
						/>

						<Textarea
							label="Kods"
							placeholder="Risinājuma pirmkods"
							value={formData.content}
							onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
							minRows={10}
							maxRows={20}
							isRequired
						/>
					</div>
				</div>

				<div className="flex justify-end gap-3 border-t border-divider px-6 py-4">
					<button
						className="rounded-md border border-divider px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
						onClick={handleClose}
						type="button"
						disabled={isSubmitting}
					>
						Atcelt
					</button>
					<GenericButton
						variant="success"
						icon={<IconPlus size={16} />}
						onClick={handleSubmit}
						isLoading={isSubmitting}>
						Pievienot risinājumu
					</GenericButton>
				</div>
			</div>
		</div>
	);
} 