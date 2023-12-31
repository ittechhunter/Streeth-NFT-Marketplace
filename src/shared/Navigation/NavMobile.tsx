import React from "react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Logo from "shared/Logo/Logo";
import { Disclosure } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { NavItemType } from "./NavigationItem";
import { NAVIGATION_DEMO_2 } from "data/navigation";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import SocialsList from "shared/SocialsList/SocialsList";
import { ChevronDownIcon } from "@heroicons/react/solid";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead } from "wagmi";
import MARKETPLACE_ABI from "../../abis/MARKETPLACE.json";

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({
  data = NAVIGATION_DEMO_2,
  onClickClose,
}) => {
  const { address } = useAccount();

  const { data: isWhiteListed } = useContractRead({
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI,
    functionName: "isWhitelisted",
    args: [address],
  });

  const _renderMenuChild = (item: NavItemType) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={index} as="li">
            <NavLink
              end
              to={{
                pathname: i.href || undefined,
              }}
              className={({ isActive }) =>
                `flex px-4 py-2.5 dark:text-neutral-200 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-[2px] ${
                  isActive ? "text-secondary-500" : "text-neutral-900"
                }`
              }
            >
              <span
                className={!i.children ? "block w-full" : ""}
                onClick={onClickClose}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="block flex-grow"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex justify-end flex-grow"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-neutral-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </NavLink>
            {i.children && (
              <Disclosure.Panel>{_renderMenuChild(i)}</Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: NavItemType, index: number) => {
    return !isWhiteListed ? (
      item.name !== "mint" && (
        <Disclosure
          key={item.id}
          as="li"
          className="text-neutral-900 dark:text-white"
        >
          <a
            className="flex w-full items-center py-2.5 px-4 font-medium uppercase tracking-wide text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-secondary-500"
            href={item.link || undefined}
            target="_blank"
          >
            <span
              className={!item.children ? "block w-full" : ""}
              onClick={onClickClose}
            >
              {item.name}
            </span>
          </a>
        </Disclosure>
      )
    ) : (
      <Disclosure
        key={item.id}
        as="li"
        className="text-neutral-900 dark:text-white"
      >
        <a
          className="flex w-full items-center py-2.5 px-4 font-medium uppercase tracking-wide text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-secondary-500"
          href={item.link || undefined}
          target={item.name === "mint" ? undefined : "_blank"}
        >
          <span
            className={!item.children ? "block w-full" : ""}
            onClick={onClickClose}
          >
            {item.name}
          </span>
        </a>
      </Disclosure>
    );
  };

  return (
    <div className="overflow-y-auto w-full max-w-sm h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      <div className="py-6 px-5">
        <Logo />
        {/* <div className="flex flex-col mt-5 text-neutral-700 dark:text-neutral-300 text-sm">
          <span>
            Discover the most outstanding articles on all topics of life. Write
            your stories and share them
          </span>

          <div className="flex justify-between items-center mt-4">
            <SocialsList itemClass="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xl" />
            <span className="block">
              <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
            </span>
          </div>
        </div> */}
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      <ul className="flex flex-col py-6 px-2 space-y-1">
        {data.map(_renderItem)}
      </ul>
      <div className="flex items-center justify-between py-6 px-5 space-x-2">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <ButtonPrimary
                        onClick={openConnectModal}
                        type="button"
                        sizeClass="px-4 py-2 sm:px-5"
                      >
                        Connect Wallet
                      </ButtonPrimary>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <ButtonPrimary
                        onClick={openChainModal}
                        type="button"
                        sizeClass="px-4 py-2 sm:px-5"
                      >
                        Wrong network
                      </ButtonPrimary>
                    );
                  }

                  return (
                    <ButtonPrimary
                      onClick={openAccountModal}
                      type="button"
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </ButtonPrimary>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default NavMobile;
