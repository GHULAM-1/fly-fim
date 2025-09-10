import { ChevronRightIcon } from "lucide-react";
import React from "react";

const MustDo = () => {
  const mustDo = [
    {
      id: 1,
      image:
        "https://cdn-imgix.headout.com/media/images/a525b125dc142a7610cb19978606c446-167-london-london-theatre-tickets-01.jpg?w=378&h=504&crop=faces&auto=compress%2Cformat&fit=min",
      title: "London Theatre Tickets",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe maxime deleniti earum, neque illum tempore debitis harum ipsa, magni fugiat ratione voluptate rerum incidunt non quibusdam est nulla esse voluptas? Quisquam vitae iure dolores optio veniam adipisci saepe dignissimos, necessitatibus porro? Quis amet inventore quam veritatis ratione ab debitis natus deleniti eaque. Voluptatem non veniam quibusdam ex sit consectetur placeat. Quam, alias. Pariatur repellendus repellat eligendi placeat, voluptatum veniam illo a consequuntur eveniet porro aspernatur iure quos, fuga dolores minima non fugiat quod similique, tempore qui? Fugiat earum minus in? Eos at magni libero autem necessitatibus ratione fuga molestias sapiente veniam explicabo, provident id iure neque tempora sint delectus veritatis totam atque accusamus rem quis ea nostrum? Iste, fuga commodi. Numquam accusamus, nihil officia vel aliquid quisquam dolorum eaque mollitia! Adipisci accusamus quis dolore et labore sunt dignissimos at maxime, temporibus consequatur quae quibusdam dolores perspiciatis, excepturi sed soluta iste?",
    },
    {
      id: 2,
      image:
        "https://cdn-imgix.headout.com/media/images/4d8d896301ac5401c4019c82ab7e5ef3-london-eye-card.jpg?w=378&h=504&crop=faces&auto=compress%2Cformat&fit=min",
      title: "London Eye",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe maxime deleniti earum, neque illum tempore debitis harum ipsa, magni fugiat ratione voluptate rerum incidunt non quibusdam est nulla esse voluptas? Quisquam vitae iure dolores optio veniam adipisci saepe dignissimos, necessitatibus porro? Quis amet inventore quam veritatis ratione ab debitis natus deleniti eaque. Voluptatem non veniam quibusdam ex sit consectetur placeat. Quam, alias. Pariatur repellendus repellat eligendi placeat, voluptatum veniam illo a consequuntur eveniet porro aspernatur iure quos, fuga dolores minima non fugiat quod similique, tempore qui? Fugiat earum minus in? Eos at magni libero autem necessitatibus ratione fuga molestias sapiente veniam explicabo, provident id iure neque tempora sint delectus veritatis totam atque accusamus rem quis ea nostrum? Iste, fuga commodi. Numquam accusamus, nihil officia vel aliquid quisquam dolorum eaque mollitia! Adipisci accusamus quis dolore et labore sunt dignissimos at maxime, temporibus consequatur quae quibusdam dolores perspiciatis, excepturi sed soluta iste?",
    },
    {
      id: 3,
      image:
        "https://cdn-imgix.headout.com/media/images/a1231c560159f52aa273e36fdb4095b6-Tower%20of%20London%20-%20Collection%20card.jpg?w=378&h=504&crop=faces&auto=compress%2Cformat&fit=min",
      title: "Tower of London",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe maxime deleniti earum, neque illum tempore debitis harum ipsa, magni fugiat ratione voluptate rerum incidunt non quibusdam est nulla esse voluptas? Quisquam vitae iure dolores optio veniam adipisci saepe dignissimos, necessitatibus porro? Quis amet inventore quam veritatis ratione ab debitis natus deleniti eaque. Voluptatem non veniam quibusdam ex sit consectetur placeat. Quam, alias. Pariatur repellendus repellat eligendi placeat, voluptatum veniam illo a consequuntur eveniet porro aspernatur iure quos, fuga dolores minima non fugiat quod similique, tempore qui? Fugiat earum minus in? Eos at magni libero autem necessitatibus ratione fuga molestias sapiente veniam explicabo, provident id iure neque tempora sint delectus veritatis totam atque accusamus rem quis ea nostrum? Iste, fuga commodi. Numquam accusamus, nihil officia vel aliquid quisquam dolorum eaque mollitia! Adipisci accusamus quis dolore et labore sunt dignissimos at maxime, temporibus consequatur quae quibusdam dolores perspiciatis, excepturi sed soluta iste?",
    },
    {
      id: 4,
      image:
        "https://cdn-imgix.headout.com/media/images/7b4d8cf54917432907457bff5fd52370-212-london-01-london-%7C-day-trips-from-london_stonehenge-tours-02.jpg?w=378&h=504&crop=faces&auto=compress%2Cformat&fit=min",
      title: "London nach Stonehenge-Touren",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe maxime deleniti earum, neque illum tempore debitis harum ipsa, magni fugiat ratione voluptate rerum incidunt non quibusdam est nulla esse voluptas? Quisquam vitae iure dolores optio veniam adipisci saepe dignissimos, necessitatibus porro? Quis amet inventore quam veritatis ratione ab debitis natus deleniti eaque. Voluptatem non veniam quibusdam ex sit consectetur placeat. Quam, alias. Pariatur repellendus repellat eligendi placeat, voluptatum veniam illo a consequuntur eveniet porro aspernatur iure quos, fuga dolores minima non fugiat quod similique, tempore qui? Fugiat earum minus in? Eos at magni libero autem necessitatibus ratione fuga molestias sapiente veniam explicabo, provident id iure neque tempora sint delectus veritatis totam atque accusamus rem quis ea nostrum? Iste, fuga commodi. Numquam accusamus, nihil officia vel aliquid quisquam dolorum eaque mollitia! Adipisci accusamus quis dolore et labore sunt dignissimos at maxime, temporibus consequatur quae quibusdam dolores perspiciatis, excepturi sed soluta iste?",
    },
  ];

  return (
    <div className="py-4 max-w-screen-2xl mx-auto 2xl:px-0">
      <h2 className="text-lg sm:text-2xl font-heading  text-[#444444]">
        Must do things in London
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-17 mt-4 sm:mt-10">
        {mustDo.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-5">
            <img
              src={item.image}
              alt={item.title}
              className="w-full sm:w-1/3 h-40 sm:h-60 object-cover rounded"
            />
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <div className="h-6 w-6 shrink-0 text-sm text-white rounded-full flex items-center justify-center bg-[#444444]">
                  {item.id}
                </div>
                <h3 className="text-xl font-heading text-[#444444]">
                  {item.title}
                </h3>
              </div>
              <p className="text-[#444444] text-[15px] font-halyard-text-light line-clamp-5">{item.description}</p>
              <button className="text-[14px] font-halyard-text font-medium  text-[#E5006E] flex gap-1 items-center">
                See tickets
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full font-halyard-text hover:cursor-pointer sm:w-auto py-3 px-12 rounded-[12px] border border-[#444444] text-[#444444]  mt-4 sm:mt-10 mx-auto block">
        Show more
      </button>
    </div>
  );
};

export default MustDo;
