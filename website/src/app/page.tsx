import { MapLyon } from "@/ressources/assets";
import { TeamMember, UsedTech } from "@/types";
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

const pythonTech: UsedTech[] = [
  {
    name: "polars",
    techLogo: "/technologies/python/polarsLogo.png"
  },
  {
    name: "pandas",
    techLogo: "/technologies/python/pandasLogo.png"
  },
  {
    name: "scikit-learn",
    techLogo: "/technologies/python/scikitlearnLogo.png",
  },
  {
    name: "matplotlib",
    techLogo: "/technologies/python/matplotlibLogo.png"
  },
  {
    name: "seaborn",
    techLogo: "/technologies/python/seabornLogo.png"
  },
  {
    name: "jupyter",
    techLogo: "/technologies/python/jupyterLogo.png"
  }
]

const devTech: UsedTech[] = [
  {
    name: "Next.js",
    techLogo: "/technologies/dev/nextLogo.png"
  },
  {
    name: "MQTT",
    techLogo: "/technologies/dev/mqttLogo.png"
  },
  {
    name: "tailwind",
    techLogo: "/technologies/dev/tailwindLogo.png"
  },
  {
    name: "websocket.io",
    techLogo: "/technologies/dev/websocketioLogo.png"
  },
  {
    name: "Postgressql",
    techLogo: "/technologies/dev/postgresLogo.png"
  }
]

const infraTech: UsedTech[] = [
  {
    name: "docker",
    techLogo: "/technologies/infra/dockerLogo.png"
  },
  {
    name: "Ubuntu",
    techLogo: "/technologies/infra/ubuntuLogo.png"
  },
  {
    name: "portainer",
    techLogo: "/technologies/infra/portainerLogo.png"
  },
  {
    name: "traefik",
    techLogo: "/technologies/infra/traefikLogo.png"
  }
]

export default function Page() {
  const noIcon = "/membersPicture/noProfilePicture.png";
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-4xl mt-15">SentiLyon</h1>
      <h1 className="font-bold text-4xl mt-15" >Presentation Du Projet</h1>
      <h2 className="mt-10 text-3xl mb-20" > Notre sujet</h2> 
      <div className="flex flex-row items-center gap-8 ml-[15%] mr-[15%]">
        <div>
          <MapLyon/>
        </div>
        <div>
        <p className="mt-10 text-xl">En 2180, la mégapole qu'est devenue Lyon est sujette à de violentes catastrophe naturelles qui détruisent la ville. <br/>
        Heureusement un groupe de jeunes experts se sont ligués pour protégé la ville des inondations, tremblements de terre, hackers et autres cataclysmes. <br/>
        Chaque unité à sa manière a pu mettre en place une solution IT pour couvrir l'ensemble des menaces possibles.</p> 
        </div>
      </div>
      <h2 className="mt-20 text-3xl mb-20">Notre équipe</h2>
      
      <h3 className="text-3xl mb-10">Dev</h3>
      <div>
        {devTeamMembers.map((member, index) => (
          <div key={`dev-${index}`} className="grid grid-cols-4 items-center gap-8 ml-[5%] mr-[5%] mb-5">
              <p className="text-xl">{member.first_name}</p>
              <p className="text-xl">{member.last_name}</p>
              <p className="text-xl  ml-20">{member.class}</p>
            <div className="w-32 h-32 rounded-full overflow-hidden ml-3">
            <Image src={member.profile_picture_url ?? noIcon} alt={`${member.first_name} ${member.last_name} picture`} width={200} height={200} />
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-3xl mt-30 mb-10">Infra/Cyber</h3>
      <div>
      {infraCyberTeamMember.map((member, index) => (
          <div key={`infra-cyber-${index}`} className="grid grid-cols-4 items-center gap-8 ml-[5%] mr-[5%] mb-5">
              <p className="text-xl">{member.first_name}</p>
              <p className="text-xl">{member.last_name}</p>
              <p className="text-xl  ml-20">{member.class}</p>
            <div className="w-32 h-32 rounded-full overflow-hidden ml-3">
              <Image src={member.profile_picture_url ?? noIcon} alt={`${member.first_name} ${member.last_name} picture`} width={200} height={200} />
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-3xl mt-30 mb-10">Data</h3>
      <div>
      {dataTeamMember.map((member, index) => (
          <div key={`data-${index}`} className="grid grid-cols-4 items-center gap-8 ml-[5%] mr-[5%] mb-5">
              <p className="text-xl">{member.first_name}</p>
              <p className="text-xl">{member.last_name}</p>
              <p className="text-xl  ml-20">{member.class}</p>
            <div className="w-32 h-32 rounded-full overflow-hidden ml-3">
            <Image src={member.profile_picture_url ?? noIcon} alt={`${member.first_name} ${member.last_name} picture`} width={200} height={200} />
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-3xl mb-20 mt-30">tecnologie utilisée</h2>
        <h3 className="text-2xl mb-20">Data</h3>
        <h4 className="text-xl mb-10">Python</h4>
        {pythonTech.map((member, index) => (
          <div key={`data-${index}`} className="grid grid-cols-2 items-center gap-8 ml-[5%] mr-[5%] mb-5">
          <p className="text-xl">{member.name}</p>
        <div className="w-32 h-32 overflow-hidden ml-3">
        <Image src={member.techLogo ?? noIcon} alt={`${member.name} logo`} width={200} height={200} />
        </div>
      </div>        
    ))}
      <h3 className="text-2xl mb-20 mt-30">Dev</h3>
      {devTech.map((member, index) => (
        <div key={`data-${index}`} className="grid grid-cols-2 items-center gap-8 ml-[5%] mr-[5%] mb-5">
          <p className="text-xl">{member.name}</p>
          <div className="w-32 h-32 overflow-hidden ml-10">
            <Image src={member.techLogo ?? noIcon} alt={`${member.name} logo`} width={200} height={200} />
          </div>
        </div>        
    ))}

    <h3 className="text-2xl mb-20 mt-30"> Infra/Cyber</h3>
    {infraTech.map((member, index) => (
        <div key={`data-${index}`} className="grid grid-cols-2 items-center gap-8 ml-[5%] mr-[5%] mb-5">
          <p className="text-xl">{member.name}</p>
          <div className="w-32 h-32 overflow-hidden ml-10">
            <Image src={member.techLogo ?? noIcon} alt={`${member.name} logo`} width={200} height={200} />
          </div>
        </div>        
    ))}
    
    </div> 
  );
}

