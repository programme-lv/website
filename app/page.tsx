'use client';
import { FeaturesGrid } from '@/components/FeaturesGrid/FeaturesGrid';
import { HeroContentLeft } from '@/components/HeroContentLeft/HeroContentLeft';
import { HeaderWithLogin } from '@/components/HeaderWithLogin/HeaderWithLogin';
import Supporters from '@/components/SupportersSection/SupportersSection';
import { Box } from '@mantine/core';

export default function HomePage() {
	return (
		<Box bg='#fafafa' style={{minHeight: "100vh", display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
			<div>
			<HeaderWithLogin />
			<HeroContentLeft />
			<FeaturesGrid />
			</div>
			<Supporters />
		</Box>
	);
}