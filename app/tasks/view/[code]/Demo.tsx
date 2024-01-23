'use client';

import { Tabs, rem } from "@mantine/core";
import { IconMessageCircle, IconPhoto, IconSettings } from "@tabler/icons-react";

export function Demo() {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="task">
      <Tabs.List>
        <Tabs.Tab value="task" >
            Apraksts
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="task">
        Gallery tab content
      </Tabs.Panel>
    </Tabs>
  );
}