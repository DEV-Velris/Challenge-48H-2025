import {MapLyon} from "@/ressources/assets";
import {TeamMember, UsedTechnology} from "@/types";
import Image from "next/image";

const devTeamMembers: TeamMember[] = [
    {
        first_name: "Thomas",
        last_name: "Foltzer",
        class: "B3",
        profile_picture_url: "/membersPicture/FoltzerThomas.jpg"
    },
    {
        first_name: "Alexis",
        last_name: "Soubieux",
        class: "B3",
        profile_picture_url: "/membersPicture/SoubieuxAlexis.jpg"
    },
    {
        first_name: "Envel",
        last_name: "Righini",
        class: "B3",
        profile_picture_url: "/membersPicture/RighiniEnvel.jpg"
    },
    {
        first_name: "Anthony",
        last_name: "Pereira",
        class: "B2",
        profile_picture_url: "/membersPicture/PereiraAnthony.jpg"
    }
]

const infraCyberTeamMember: TeamMember[] = [
    {
        first_name: "Mayeul",
        last_name: "Boeri",
        class: "B3",
        profile_picture_url: "/membersPicture/BoeriMayeul.jpg"
    },
    {
        first_name: "Dorian",
        last_name: "Tatoulian",
        class: "B3",
    },
    {
        first_name: "Corentin",
        last_name: "Delpree",
        class: "B2",
        profile_picture_url: "/membersPicture/DelpreeCorentin.jpg"
    },
    {
        first_name: "Mathieu",
        last_name: "Marchand",
        class: "B1",
        profile_picture_url: "/membersPicture/MarchandMathieu.jpg"
    }
]

const dataTeamMember: TeamMember[] = [
    {
        first_name: "Corentin",
        last_name: "Sanjuan",
        class: "B3",
        profile_picture_url: "/membersPicture/SanjuanCorentin.png"
    },
    {
        first_name: "Yousri",
        last_name: "Berriche",
        class: "B1",
        profile_picture_url: "/membersPicture/BerricheYousri.jpg"
    }
]

const pythonTech: UsedTechnology[] = [
    {
        name: "Polars",
        techLogo: "/technologies/python/polarsLogo.png"
    },
    {
        name: "Pandas",
        techLogo: "/technologies/python/pandasLogo.png"
    },
    {
        name: "Scikit-learn",
        techLogo: "/technologies/python/scikitlearnLogo.png",
    },
    {
        name: "Matplotlib",
        techLogo: "/technologies/python/matplotlibLogo.png"
    },
    {
        name: "Seaborn",
        techLogo: "/technologies/python/seabornLogo.png"
    },
    {
        name: "Jupyter",
        techLogo: "/technologies/python/jupyterLogo.png"
    }
]

const devTech: UsedTechnology[] = [
    {
        name: "Next.js",
        techLogo: "/technologies/dev/nextLogo.png"
    },
    {
        name: "Tailwind",
        techLogo: "/technologies/dev/tailwindLogo.png"
    },
    {
        name: "MQTT",
        techLogo: "/technologies/dev/mqttLogo.png"
    },
    {
        name: "Socket.io",
        techLogo: "/technologies/dev/websocketioLogo.png"
    },
    {
        name: "Prisma",
        techLogo: "/technologies/dev/prismaLogo.png"
    },
    {
        name: "Postgres",
        techLogo: "/technologies/dev/postgresLogo.png"
    }
]

const infraTech: UsedTechnology[] = [
    {
        name: "Docker",
        techLogo: "/technologies/infra/dockerLogo.png"
    },
    {
        name: "Azure",
        techLogo: "/technologies/infra/azureLogo.png"
    },
    {
        name: "Defender",
        techLogo: "/technologies/infra/defenderLogo.png"
    }
]

export default function Page() {
    const noIcon = "/membersPicture/noProfilePicture.png";
    return (
        <div className="flex flex-col gap-16 mt-16">
            <div className={"flex flex-col justify-center items-center w-full"}>
                <h1 className="text-red">Presentation Du Projet</h1>
                <h2 className="mt-8 text-gray-1"> Notre sujet</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-16">
                    <div>
                        <p className={"md:w-xl p-6 text-justify text-gray-1"}>
                            En 2180, la mégapole qu&#39;est devenue Lyon est sujette à de
                            violentes catastrophe naturelles qui détruisent la ville. <br/>
                            Heureusement un groupe de jeunes experts se sont ligués pour protégé la ville des
                            inondations, tremblements de terre, hackers et autres cataclysmes. <br/>
                            Chaque unité à sa manière a pu mettre en place une solution IT pour couvrir l&#39;ensemble
                            des menaces possibles.
                        </p>
                    </div>
                    <MapLyon/>
                </div>
            </div>
            <div className={"flex flex-col w-full"}>
                {/* Membres */}
                <div className={"mb-16"}>
                    <h2 className="text-center text-gray-1 mb-8">Notre équipe</h2>

                    <div>
                        <h3 className="text-center text-blue opacity-80 mb-8">Dev</h3>
                        <div className={"flex flex-col md:flex-row justify-center items-center gap-16"}>
                            {devTeamMembers.map((member, index) => (
                                <div key={`dev-${index}`} className="flex flex-col items-center gap-1">
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <Image
                                            src={member.profile_picture_url ?? noIcon}
                                            alt={`${member.first_name} ${member.last_name} picture`}
                                            width={128}
                                            height={128}
                                            className="object-cover w-32 h-32"
                                        />
                                    </div>
                                    <div className={"flex flex-col gap-1 md:flex-row"}>
                                        <p className="text-gray-1">{member.first_name}</p>
                                        <p className="text-gray-1">{member.last_name}</p>
                                    </div>
                                    <p className="text-gray-1">{member.class}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={"mt-8"}>
                        <h3 className="text-center text-blue opacity-80 mb-8 ">Infra / Cyber</h3>
                        <div className={"flex flex-col md:flex-row justify-center items-center gap-16"}>
                            {infraCyberTeamMember.map((member, index) => (
                                <div key={`dev-${index}`} className="flex flex-col items-center gap-1">
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <Image
                                            src={member.profile_picture_url ?? noIcon}
                                            alt={`${member.first_name} ${member.last_name} picture`}
                                            width={128}
                                            height={128}
                                            className="object-cover w-32 h-32"
                                        />
                                    </div>
                                    <div className={"flex flex-col gap-1 md:flex-row"}>
                                        <p className="text-gray-1">{member.first_name}</p>
                                        <p className="text-gray-1">{member.last_name}</p>
                                    </div>
                                    <p className="text-gray-1">{member.class}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={"mt-8"}>
                        <h3 className="text-center text-blue opacity-80 mb-8">Data</h3>
                        <div className={"flex flex-col md:flex-row justify-center items-center gap-16"}>
                            {dataTeamMember.map((member, index) => (
                                <div key={`dev-${index}`} className="flex flex-col items-center gap-1">
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <Image
                                            src={member.profile_picture_url ?? noIcon}
                                            alt={`${member.first_name} ${member.last_name} picture`}
                                            width={128}
                                            height={128}
                                            className="object-cover w-32 h-32"
                                        />
                                    </div>
                                    <div className={"flex flex-col gap-1 md:flex-row"}>
                                        <p className="text-gray-1">{member.first_name}</p>
                                        <p className="text-gray-1">{member.last_name}</p>
                                    </div>
                                    <p className="text-gray-1">{member.class}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technologies */}
                <h2 className="text-center text-gray-1 mb-8">Technologies utilisées</h2>
                <div className={"mb-8"}>
                    <h3 className="mb-8 text-center text-blue opacity-80">Dev</h3>
                    <div className={"flex flex-col md:flex-row justify-center items-center gap-16"}>
                        {devTech.map((tech, index) => (
                            <div key={`dev-${index}`} className="flex flex-col items-center gap-1">
                                <div className="w-20 h-20">
                                    <Image
                                        src={tech.techLogo}
                                        alt={`${tech.name} picture`}
                                        width={128}
                                        height={128}
                                        className="object-contain w-20 h-20"
                                    />
                                </div>
                                <p className={"text-gray-1"}>{tech.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={"mb-8"}>
                    <h3 className="text-center text-blue opacity-80 mb-8">Infra / Cyber</h3>
                    <div className={"flex flex-col md:flex-row justify-center items-center gap-16"}>
                        {infraTech.map((tech, index) => (
                            <div key={`dev-${index}`} className="flex flex-col items-center gap-1">
                                <div className="w-32 h-32 rounded-full overflow-hidden">
                                    <Image
                                        src={tech.techLogo}
                                        alt={`${tech.name} picture`}
                                        width={128}
                                        height={128}
                                        className="object-contain w-32 h-32"
                                    />
                                </div>
                                <p className={"text-gray-1"}>{tech.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-center text-blue opacity-80 mb-8 ">Data</h3>
                    <div className={"flex flex-col md:flex-row justify-center items-center gap-16"}>
                        {pythonTech.map((tech, index) => (
                            <div key={`dev-${index}`} className="flex flex-col items-center gap-1">
                                <div className="w-32 h-32 rounded-full overflow-hidden">
                                    <Image
                                        src={tech.techLogo}
                                        alt={`${tech.name} picture`}
                                        width={128}
                                        height={128}
                                        className="object-contain w-32 h-32"
                                    />
                                </div>
                                <p className={"text-gray-1"}>{tech.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

