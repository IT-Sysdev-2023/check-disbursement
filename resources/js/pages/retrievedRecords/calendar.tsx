import { useEffect, useState } from 'react';

const Calendar = () => {
  const [day, setDay] = useState<{
    month: string;
    days: number[];
  }>({ month: '', days: [] });

  useEffect(() => {
    const calendarDays = async () => {
      const res = await axios.get('calendar');
      setDay(res.data);
    };

    calendarDays();
  }, []);
  return (
    <>

      <span className="text-5xl">{day.month}</span>

      {/* <!-- ====== Calendar Section Start ====== --> */}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-10">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Sunday </span>
                <span className="block lg:hidden"> Sun </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Monday </span>
                <span className="block lg:hidden"> Mon </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Tuesday </span>
                <span className="block lg:hidden"> Tue </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Wednesday </span>
                <span className="block lg:hidden"> Wed </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Thursday </span>
                <span className="block lg:hidden"> Thur </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Friday </span>
                <span className="block lg:hidden"> Fri </span>
              </th>
              <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                <span className="hidden lg:block"> Saturday </span>
                <span className="block lg:hidden"> Sat </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {day.days?.map((item: any, key: any) => (
              <tr className="grid grid-cols-7" key={key}>
                {item.map((day: { day: number; holiday: string, isCurrent: boolean }) => (
                  <td
                    key={day.day}
                    className={` ${day.isCurrent && 'bg-meta-2'} ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31`}
                  >
                    <span className={`${day.isCurrent && 'text-meta-5'} font-medium text-black dark:text-white`}>
                      {day.day}
                    </span>


                    {day.holiday && (<div className="group h-16 w-full flex-grow cursor-pointer py-1 md:h-30">
                      <span className="group-hover:text-primary md:hidden">
                        More
                      </span>
                      <div className="event invisible absolute left-2 z-99 mb-1 flex w-[200%] flex-col rounded-sm border-l-[3px] border-primary bg-gray px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-[90%] md:opacity-100">
                        <span className="event-name text-sm font-semibold text-black dark:text-white">
                         {day.holiday}
                        </span>
                        {/* <span className="time text-sm font-medium text-black dark:text-white">
                          1 Dec - 2 Dec
                        </span> */}
                      </div>
                    </div>)}
                    
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Calendar;
