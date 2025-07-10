import { TextLink } from "@/components/text-link";

interface TaskAdminNavProps {
  taskId: string;
  activeTab: string;
}

type NavItem = {
  key: string;
  label: string;
  href: string;
  disabled?: boolean;
};

export default function TaskAdminNav({ taskId, activeTab }: TaskAdminNavProps) {
  const navItems: NavItem[] = [
    {
      key: "task",
      label: "Uzdevums",
      href: `/admin/task/${taskId}`,
    },
    {
      key: "statement", 
      label: "Formulējums",
      href: `/admin/task/${taskId}/statement`,
    },
    {
      key: "examples",
      label: "Piemēri",
      href: `/admin/task/${taskId}/examples`,
    },
    {
      key: "testing",
      label: "Testēšana", 
      href: `/admin/task/${taskId}/testing`,
    },
    {
      key: "solutions",
      label: "Risinājumi",
      href: `/admin/task/${taskId}/solutions`,
    },
    {
      key: "archive",
      label: "Arhīvs",
      href: `/admin/task/${taskId}?tab=archive`, 
      disabled: true,
    },
    {
      key: "history",
      label: "Vēsture",
      href: `/admin/task/${taskId}?tab=history`,
      disabled: true,
    },
  ];

  return (
    <div className="w-56 flex-shrink-0">
      <div className="sticky top-3 m-3 p-4 bg-white border border-divider">
        <nav className="flex flex-col gap-2">
          <div className="font-medium mb-2">Rediģējamās sadaļas</div>
          {navItems.map((item) => (
            <div
              key={item.key}
              className={activeTab === item.key ? "font-semibold" : ""}
            >
              <TextLink href={item.href} disabled={item.disabled}>
                {item.label}
              </TextLink>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

export { TaskAdminNav }; 