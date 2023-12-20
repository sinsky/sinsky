import {
  Avatar,
  Card,
  Image,
  Badge,
  Text,
  Flex,
  Grid,
  Tooltip,
} from "@mantine/core";
import React from "react";
import {
  SiTypescript,
  SiRust,
  SiPython,
  SiJavascript,
  SiPhp,
  SiC,
  SiDjango,
  SiFlask,
  SiJest,
  SiPlaywright,
  SiReact,
  SiSelenium,
  SiVite,
  SiNextdotjs,
  SiTrpc,
  SiTailwindcss,
  SiMantine,
  SiPowerbi,
  SiGithub,
  SiDocker,
  SiGooglecloud,
  SiCloudflare,
  SiVercel,
  SiNetlify,
  SiSupabase,
} from "react-icons/si";

const avatarSize = 8 * 6;
const iconSize = 8 * 5;

const IconCard = ({
  Icon,
  title,
  color,
}: {
  Icon: React.ElementType;
  title: string;
  color?: string;
}) => (
  <Tooltip label={title} withArrow key={title}>
    <Avatar size={avatarSize} alt={`${title} logo`} color={color}>
      <Icon size={iconSize} />
    </Avatar>
  </Tooltip>
);

export default function Skills() {
  return (
    <>
      <h2>スキル</h2>
      <h3>プログラミング言語(順不同)</h3>
      <Flex>
        <IconCard
          Icon={SiJavascript}
          color="rgba(240, 223, 90, 1)"
          title="JavaScript"
        />
        <IconCard
          Icon={SiTypescript}
          title="TypeScript"
          color="rgba(43, 116, 136, 1)"
        />
        <IconCard Icon={SiPhp} title="PHP" color="rgba(79, 93, 149, 1)" />
        <IconCard Icon={SiC} title="C" color="rgba(85, 85, 85, 1)" />
        <IconCard
          Icon={SiPython}
          title="Python"
          color="rgba(53, 114, 165, 1)"
        />
        <IconCard Icon={SiRust} title="Rust" color="rgba(222, 164, 131, 1)" />
      </Flex>
      <h3>ライブラリ/フレームワーク(順不同)</h3>
      <Flex>
        <IconCard Icon={SiDjango} title="Django" />
        <IconCard Icon={SiFlask} title="Flask" />
        <IconCard Icon={SiReact} title="React" />
        <IconCard Icon={SiVite} title="Vite" />
        <IconCard Icon={SiNextdotjs} title="Next.js" />
        <IconCard Icon={SiTrpc} title="Trpc" />
        <IconCard Icon={SiJest} title="Jest" />
        <IconCard Icon={SiPlaywright} title="Playwright" />
        <IconCard Icon={SiSelenium} title="Selenium" />
        <IconCard Icon={SiTailwindcss} title="TailwindCSS" />
        <IconCard Icon={SiMantine} title="Mantine" />
      </Flex>
      <h3>資格</h3>
      <Grid grow gutter={"md"} align="stretch">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Flex align={"center"} justify={"center"}>
                <div style={{ margin: "4px" }}>
                  <Image
                    w={80}
                    h={80}
                    src="https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/86393060"
                    alt="Associate Cloud Engineer Badge for Google Cloud"
                    styles={{ root: { userSelect: "none" } }}
                    draggable={false}
                  />
                </div>
                <Flex
                  direction={"column"}
                  justify={"center"}
                  mx={"sm"}
                  align={"center"}
                >
                  <Text fw={500}>Associate Cloud Engineer</Text>
                  <Badge color="blue">Google Cloud</Badge>
                </Flex>
              </Flex>
            </Card.Section>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Flex
              direction={"column"}
              justify={"center"}
              mx={"sm"}
              align={"center"}
            >
              <Text fw={500}>Python3 エンジニア認定基礎試験</Text>
              <Badge>odyssey</Badge>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
      <h3>その他ツール</h3>
      <Flex>
        <IconCard Icon={SiDocker} title="Docker" />
        <IconCard Icon={SiGithub} title="Github" />
        <IconCard Icon={SiGooglecloud} title="Google Cloud" />
        <IconCard Icon={SiVercel} title="Vercel" />
        <IconCard Icon={SiCloudflare} title="Cloudflare" />
        <IconCard Icon={SiNetlify} title="Netlify" />
        <IconCard Icon={SiSupabase} title="Supabase" />
        <IconCard Icon={SiPowerbi} title="PowerBI" />
        <Tooltip label="ServiceNow" withArrow>
          <Image
            w={160}
            h={avatarSize}
            src={"/sn-logo-color.avif"}
            alt="servicenow logo"
            draggable={false}
          />
        </Tooltip>
      </Flex>
    </>
  );
}
