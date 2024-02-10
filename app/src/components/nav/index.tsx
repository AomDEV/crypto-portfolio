"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { MENU } from "./constant";
import { usePathname } from "next/navigation";

export default function Nav() {
    const pathname = usePathname()
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {MENU.map((menu, index) => (
                    <NavigationMenuItem key={index}>
                        <Link href={menu.href} legacyBehavior passHref>
                            <NavigationMenuLink active={pathname === menu.href} className={navigationMenuTriggerStyle({className: menu.className})}>
                                {menu.label}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}