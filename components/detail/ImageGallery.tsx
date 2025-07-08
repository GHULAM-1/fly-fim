import React from "react";

const ImageGallery = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mt-4">
        <img
          src="https://cdn-imgix.headout.com/media/images/b4366e3c12eba423a6acd89a8c6dcd6a-combo-27920-London-Combo-Save10---LondonEyeTickets-ThamesRiverCruise-14.jpg?w=1302&h=813.75&crop=faces&auto=compress%2Cformat&fit=min"
          alt=""
        />
        <div className="grid grid-cols-2 gap-2">
          <img
            src="https://cdn-imgix.headout.com/media/images/30c9ceee5b6ebf2929c7c4cd0344f1ae-27920-london-27920---combo-listing---kew-gardens---london-eye-09.jpg?w=613.2&h=384.3&crop=faces&auto=compress%2Cformat&fit=min"
            alt=""
          />
          <img
            src="https://cdn-imgix.headout.com/media/images/38a2690ad8d1b03864f76197f32410bc-28235-Combo-LondonEyeTickets-Hop-OnHop-OffBusTour-ThamesRiverCruise---0001kq.jpg?w=613.2&h=384.3&crop=faces&auto=compress%2Cformat&fit=min"
            alt=""
          />
          <img
            src="https://cdn-imgix.headout.com/media/images/1d8a3180b143301173944d525406e679-28935-london-thames-sightseeing-cruise-01.jpg?w=613.2&h=384.3&crop=faces&auto=compress%2Cformat&fit=min"
            alt=""
          />
          <img
            src="https://cdn-imgix.headout.com/media/images/0ef30dc8a78f400bc54b128492d15985-27915-london-arsenal-fc-emirates-stadium-tour---london-eye-admission-tickets-11.jpg?w=613.2&h=384.3&crop=faces&auto=compress%2Cformat&fit=min"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
