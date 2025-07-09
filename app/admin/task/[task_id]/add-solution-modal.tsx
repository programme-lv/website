"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import FileUpload from "@/components/file-upload";
import { ProgrammingLanguage } from "@/types/proglv";
import { listProgrammingLanguages } from "@/lib/langs";
import { useQuery } from "@tanstack/react-query";
import GenericButton from "../../../../components/generic-button";

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

// File extension to language mapping
const extensionToLanguage: Record<string, string> = {
	'.py': 'python311',
	'.cpp': 'cpp17',
	'.cc': 'cpp17',
	'.cxx': 'cpp17',
	'.c': 'c11',
	'.java': 'java17',
	'.js': 'javascript',
	'.ts': 'typescript',
	'.go': 'go',
	'.rs': 'rust',
	'.php': 'php',
	'.rb': 'ruby',
	'.cs': 'csharp',
	'.kt': 'kotlin',
	'.scala': 'scala',
	'.hs': 'haskell',
	'.ml': 'ocaml',
	'.pas': 'pascal',
	'.pl': 'perl'
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
			// Set default language to cpp17 if available, otherwise first enabled language
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
		// Validation
		if (!formData.filename.trim()) {
			alert('Lūdzu, ievadiet faila nosaukumu.');
			return;
		}
		if (!formData.programmingLanguage) {
			alert('Lūdzu, izvēlieties programmēšanas valodu.');
			return;
		}
		if (!formData.content.trim()) {
			alert('Lūdzu, ievadiet kodu.');
			return;
		}
		if (!formData.author.trim()) {
			alert('Lūdzu, ievadiet autora vārdu.');
			return;
		}
		if (!formData.expectedResult.trim()) {
			alert('Lūdzu, ievadiet sagaidāmo rezultātu.');
			return;
		}

		setIsSubmitting(true);
		try {
			onSolutionAdded(formData);
			// Reset form
			setFormData({
				filename: '',
				programmingLanguage: languages?.find(l => l.id === "cpp17" && l.enabled)?.id || languages?.find(l => l.enabled)?.id || '',
				content: '',
				author: '',
				expectedResult: ''
			});
			onOpenChange(); // Close modal
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

	const getLanguageDisplayName = (langId: string): string => {
		const lang = languages?.find(l => l.id === langId);
		return lang ? lang.fullName : langId;
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={handleClose}
			isKeyboardDismissDisabled={isSubmitting}
			size="2xl"
			classNames={{
				base: "bg-transparent shadow-none",
				wrapper: "p-0"
			}}
			radius="sm"
		>
			<ModalContent>
				{(onClose) => (
					<div className="bg-background border-small border-default-300 rounded-md overflow-hidden">
						<ModalHeader className="bg-white p-4 border-b border-default-300">
							<span className="text-lg font-semibold">Pievienot risinājumu</span>
						</ModalHeader>

						<ModalBody className="p-4 bg-white">
							<div className="flex flex-col gap-4">
								<FileUpload
									onFileSelect={handleFileSelect}
									acceptedTypes=".py,.cpp,.cc,.cxx,.c,.java,.js,.ts,.go,.rs,.php,.rb,.cs,.kt,.scala,.hs,.ml,.pas,.pl"
									variant="secondary"
									size="sm"
									icon={<IconUpload size={16} />}
								>
									Izvēlēties failu
								</FileUpload>

								{/* Filename */}
								<Input
									label="Faila nosaukums"
									placeholder="piemēram, solution1.py"
									value={formData.filename}
									onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))}
									size="sm"
									variant="underlined"
									isRequired
								/>

								{/* Programming Language */}
								<div className="flex flex-col gap-1">
									{languages && (
										<Select
											label="Programmēšanas valoda"
											isRequired
											className="max-w-full"
											radius="sm"
											classNames={{
												popoverContent: "rounded-small border-small border-divider",
											}}
											disallowEmptySelection
											selectedKeys={[formData.programmingLanguage]}
											size="sm"
											variant="underlined"
											disableAnimation
											onSelectionChange={(selectedKeys) => {
												const key = Array.from(selectedKeys)[0];
												setFormData(prev => ({ ...prev, programmingLanguage: key as string }));
											}}
											items={languages.filter(lang => lang.enabled)}
											selectionMode="single"
										>
											{(item) => <SelectItem key={item.id}>{item.fullName}</SelectItem>}
										</Select>
									)}
								</div>

								{/* Author */}
								<Input
									label="Autors"
									placeholder="Risinājuma autora vārds"
									value={formData.author}
									onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
									size="sm"
									variant="underlined"
									isRequired
								/>

								{/* Expected Result */}
								<Input
									label="Sagaidāmais rezultāts"
									placeholder="piemēram: 100/100 @ 1.00s & 256 MiB"
									value={formData.expectedResult}
									onChange={(e) => setFormData(prev => ({ ...prev, expectedResult: e.target.value }))}
									size="sm"
									variant="underlined"
									isRequired
								/>

								{/* Content */}
								<Textarea
									label="Kods"
									placeholder="Risinājuma pirmkods"
									value={formData.content}
									onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
									minRows={10}
									maxRows={20}
									variant="underlined"
									isRequired
								/>
							</div>
						</ModalBody>

						<ModalFooter className="bg-white p-4 border-t border-default-300">
							<Button disableAnimation color="danger" variant="light" onPress={handleClose} isDisabled={isSubmitting}>
								Atcelt
							</Button>
							<GenericButton
								variant="success"
								icon={<IconPlus size={16} />}
								onClick={handleSubmit}
								isLoading={isSubmitting}>
								Pievienot risinājumu
							</GenericButton>
						</ModalFooter>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
} 