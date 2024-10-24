import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, useParams } from "react-router-dom";
import {
  House,
  Book,
  PencilLine,
  Hand,
  User,
  Settings,
  Menu,
} from "lucide-react";

const menuItems = [
  { to: "", icon: House, label: "Home" },
  { to: "labs", icon: Book, label: "Labs" },
  { to: "quizzes", icon: PencilLine, label: "Quiz" },
  { to: "classparts", icon: Hand, label: "Class Participation" },
  { to: "students", icon: User, label: "Students" },
  { to: "settings", icon: Settings, label: "Settings" },
];

const TopNavBar: React.FC = () => {
  const { courseId } = useParams();
  const [isOpen, setIsOpen] = useState(false); // State to control the hamburger menu

  const toggleMenu = () => setIsOpen(!isOpen); // Toggle menu visibility

  return (
    <div>
      {/* Hamburger icon that shows only on small screens */}
      <div className="md:hidden p-4 cursor-pointer">
        <Menu size={24} strokeWidth={1.5} onClick={toggleMenu} />
      </div>

      {/* Navigation Menu that toggles based on screen size or menu state */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute  md:relative md:flex md:flex-row md:items-center`}
      >
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col w-50 md:flex-row">
            {/* Each Link and Menu Item */}
            {menuItems.map((item) => (
              <Link
                to={`/courses/${courseId}/${item.to}`}
                key={item.label}
                className="w-full text-left "
              >
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <item.icon
                      size={16}
                      strokeWidth={1.5}
                      style={{ marginRight: "8px" }}
                    />
                    {item.label}
                  </NavigationMenuTrigger>
                </NavigationMenuItem>
              </Link>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default TopNavBar;
