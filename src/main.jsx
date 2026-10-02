import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { USER_IDS, API_BASE } from "./config";
import "./style.css";

const BADGES = {
  nitro:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/discordnitro.svg",

  PremiumEarlySupporter:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/discordearlysupporter.svg",

  ActiveDeveloper:
    "https://raw.githubusercontent.com/efeeozc/discord-badges/6c54af4b871af1e6daef9722f02257af18446129/svg/activedeveloper.svg",

  HypeSquadOnlineHouse1:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/hypesquadbravery.svg",

  HypeSquadOnlineHouse2:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/hypesquadbrilliance.svg",

  HypeSquadOnlineHouse3:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/hypesquadbalance.svg",

  VerifiedDeveloper:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/discordbotdev.svg",

  novo_nick:
    "https://github.com/mezotv/discord-badges/blob/main/assets/username.png?raw=true",
};

const BOOST_BADGES = {
  guild_booster_lvl1:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost1.svg",

  guild_booster_lvl2:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost2.svg",

  guild_booster_lvl3:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost3.svg",

  guild_booster_lvl4:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost4.svg",

  guild_booster_lvl5:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost5.svg",

  guild_booster_lvl6:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost6.svg",

  guild_booster_lvl7:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost7.svg",

  guild_booster_lvl8:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost8.svg",

  guild_booster_lvl9:
    "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/boosts/discordboost9.svg",
};

const NITRO_BADGES = {
  nitro_bronze:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/bronze.png",

  nitro_silver:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/silver.png",

  nitro_gold:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/gold.png",

  nitro_platinum:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/platinum.png",

  nitro_diamond:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/diamond.png",

  nitro_emerald:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/emerald.png",

  nitro_ruby:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/ruby.png",

  nitro_fire:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/subscriptions/badges/opal.png",
};

const API_BADGE_MAP = {
  verified_developer: BADGES.VerifiedDeveloper,
  early_supporter: BADGES.PremiumEarlySupporter,
  active_developer: BADGES.ActiveDeveloper,
  hypesquad_bravery: BADGES.HypeSquadOnlineHouse1,
  hypesquad_brilliance: BADGES.HypeSquadOnlineHouse2,
  hypesquad_balance: BADGES.HypeSquadOnlineHouse3,
  legacy_username: BADGES.novo_nick,
};

function getAllBadges(data) {
  const rawBadges = Array.isArray(data?.badges)
    ? data.badges
    : [];

  const badges = rawBadges
    .map((badge) => {
      if (typeof badge === "string") {
        return badge;
      }

      if (badge && typeof badge === "object") {
        return badge.id || null;
      }

      return null;
    })
    .filter(Boolean);

  const result = [];

  const currentNitro = data?.nitro?.current_badge;

  if (
    currentNitro &&
    badges.includes(currentNitro) &&
    NITRO_BADGES[currentNitro]
  ) {
    result.push({
      key: `nitro-${currentNitro}`,
      url: NITRO_BADGES[currentNitro],
    });
  } else {
    const directNitro = badges.find((badge) =>
      Object.prototype.hasOwnProperty.call(
        NITRO_BADGES,
        badge
      )
    );

    if (directNitro) {
      result.push({
        key: `nitro-${directNitro}`,
        url: NITRO_BADGES[directNitro],
      });
    }
  }

  for (const badge of badges) {
    // Não mostrar premium_tenure porque
    // isso já está representado pelo badge Nitro.
    if (badge.startsWith("premium_tenure_")) {
      continue;
    }

    // Nitro já foi tratado acima.
    if (
      Object.prototype.hasOwnProperty.call(
        NITRO_BADGES,
        badge
      )
    ) {
      continue;
    }

    // Boost somente quando realmente existir
    // dentro de data.badges.
    if (
      Object.prototype.hasOwnProperty.call(
        BOOST_BADGES,
        badge
      )
    ) {
      result.push({
        key: badge,
        url: BOOST_BADGES[badge],
      });

      continue;
    }

    // Outros badges.
    if (
      Object.prototype.hasOwnProperty.call(
        API_BADGE_MAP,
        badge
      )
    ) {
      result.push({
        key: badge,
        url: API_BADGE_MAP[badge],
      });
    }
  }

  // Remove duplicados.
  return result.filter(
    (item, index, array) =>
      index ===
      array.findIndex(
        (other) => other.key === item.key
      )
  );
}

async function fetchUser(id) {
  const url = `${API_BASE}/${encodeURIComponent(id)}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} - ${url}`
    );
  }

  return response.json();
}

function ProfileCard({ data }) {
  const user = data?.user || {};

  const badges = getAllBadges(data);

  const displayName =
    user.global_name ||
    user.username ||
    "Unknown";

  const username =
    user.username ||
    user.tag ||
    "unknown";

  return (
    <article className="profile-card">
      <div className="avatar-wrapper">
        {user.avatar_url ? (
          <img
            className="avatar"
            src={user.avatar_url}
            alt=""
            draggable="false"
          />
        ) : (
          <div className="avatar avatar-fallback">
            ?
          </div>
        )}
      </div>

      <div className="profile-info">
        <div className="name">
          {displayName}
        </div>

        <div className="username">
          @{username}
        </div>
      </div>

      {badges.length > 0 && (
        <div className="badges">
          {badges.map((badge) => (
            <img
              key={badge.key}
              src={badge.url}
              alt=""
              className="badge"
              draggable="false"
            />
          ))}
        </div>
      )}
    </article>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    if (!Array.isArray(USER_IDS) || USER_IDS.length === 0) {
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      const results = await Promise.all(
        USER_IDS.map(async (id) => {
          try {
            const data = await fetchUser(id);

            console.log(
              `[API] Usuário ${id} carregado`,
              data
            );

            return {
              id,
              data,
              error: false,
            };
          } catch (error) {
            console.error(
              `[API] Erro ao carregar ${id}:`,
              error
            );

            return {
              id,
              data: null,
              error: true,
            };
          }
        })
      );

      setUsers(results);
    } catch (error) {
      console.error(
        "[API] Erro geral:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();

    const interval = setInterval(
      loadUsers,
      15 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="page">
      <section className="profiles">
        {loading ? (
          <div className="loading">
            <span className="loading-dot" />
          </div>
        ) : (
          users.map((item) => {
            if (
              !item.data ||
              item.error
            ) {
              return null;
            }

            return (
              <ProfileCard
                key={item.id}
                data={item.data}
              />
            );
          })
        )}
      </section>
    </main>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
