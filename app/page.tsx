'use client';
import { FeaturesGrid } from '@/components/FeaturesGrid/FeaturesGrid';
import { HeroContentLeft } from '@/components/HeroContentLeft/HeroContentLeft';
import { HeaderWithLogin } from '@/components/HeaderWithLogin/HeaderWithLogin';
import Supporters from '@/components/SupportersSection/SupportersSection';
import { Box } from '@mantine/core';
import { Text } from '@mantine/core';
import { Container } from '@mantine/core';

export default function HomePage() {
	return (
		<Box bg='#fafafa' style={{minHeight: "100vh", display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
			<div>
			<HeaderWithLogin />
			<HeroContentLeft />
			<Container>
				<Text ta={'center'} fw={'bold'} mt={'xl'} pt={'xl'} c={'red'} size='28pt'>Uzmanību! Mājaslapā norisinās celtniecības darbi!</Text>
			</Container>
			<FeaturesGrid />
			</div>
			<Supporters />
		</Box>
	);
}