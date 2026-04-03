// src/pages/home.tsx

import Footer from "../components/Footer";
import Header from "../components/Header";
import MyButton from "../components/MyButton";
import SectionText from "../components/SectionText";

export default function Home() {
    return (
        <div className="relative"> {/* Adding relative here for the reference */}
            
            {/* ---------------------------------------HEADER--------------------------------------- */}
            <div className="absolute top-0 left-0 w-full z-50">
                <Header />
            </div>

            {/* Hero section now occupies 100% of the actual screen height */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#231f1d]">
                
                {/* ---------------------------------------VIDEO IN THE BG--------------------------------------- */}

                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute z-0 w-full h-full object-cover opacity-60"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-waiter-serving-a-glass-of-wine-40432-large.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-[#231f1d]/40 z-10"></div>

                {/* ---------------------------------------CONTENT--------------------------------------- */}
                <div className="relative z-20 flex flex-col items-center gap-12">

                    {/* ---------------------------------------CENTRAL LOGO--------------------------------------- */}
                    
                    <div className="w-72 h-72 md:w-96 md:h-96 bg-white rounded-full flex items-center justify-center shadow-2xl">
                        <div className="text-center text-black px-6">
                            <h1 className="font-mono text-2xl md:text-3xl uppercase tracking-[0.3em] leading-tight border-b border-black pb-2 mb-2">
                                Le <br /> Général
                            </h1>
                            <p className="text-[10px] tracking-[0.4em] uppercase font-light">
                                Café · Bar · Grill
                            </p>
                        </div>
                    </div>

                    {/* ---------------------------------------BUTTON--------------------------------------- */}
                    <MyButton 
                        label="RÉSERVER"
                        variant="black"
                        rounded={true}
                        onClick={() => console.log("Clic !")}
                    />
    
                </div>

            </section>

            {/* ---------------------------------------TEXT SECTION--------------------------------------- */}

            <SectionText
                title="Le Général Wagram : Brasserie chic et cuisine française en continue"
                description={`Au pied de l'Arc de Triomphe, Le Général Wagram bat au rythme de Paris, jour et nuit. Une brasserie de tradition où la cuisine française s'exprime en continu, 7j/7 et 24h/24. Du petit-déjeuner en terrasse aux dîners tardifs, notre équipe vous accueille dans un décor boisé et feutré. Ici, l’élégance n’exclut pas la convivialité. Bienvenue chez vous, au cœur du XVIIe.`}
            />

            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.

Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet.
            </div>
            <Footer />
        </div>
    )

}