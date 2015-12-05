import PIL
from PIL import Image
import os
import shutil

modes = ("1", "2", "3")
print("Tacnet.io Icon Converter")
print("")
print("1. Create two folders in the same directory as this file, input and output.")
print("2. Paste the images in the input folder. The images must end with .png or .jpg")
print("Mode 1: Regular converting. Underscores will be removed for tooltips etc., "
      "so namepart1_namepart2 will be shown as Namepart1 Namepart2 later on.")
print("Mode 2: Image names are on the form, name_type.png, example: grenade_icon.png --> "
      "grenade.png")
print("Mode 3: Image names are on the form, type_name.png, example: weapon_ak47.png --> ak47.png")

mode = input("Enter mode: ")
while mode not in modes:
    mode = input("Enter mode: ")

deletePrompt = input("Do you want to delete everything in the output-folder? [y/n]")
while deletePrompt not in ("y", "n"):
    deletePrompt = input("Do you want to delete everything in the output-folder? [y/n]")


try:
    if deletePrompt.lower() == "y":
        print("Deleting output-folder..")
        shutil.rmtree("output/")
        print("Remaking output-folder..")
        os.makedirs("output/")

    for file in os.listdir("input/"):
        if os.path.isfile("input/" + file) and \
                (file[len(file)-4:len(file)] == ".png" or file[len(file)-4:len(file)] == ".jpg"):

            basewidth = 60

            img = Image.open("input/" + file)
            png_info = img.info
            wpercent = (basewidth/float(img.size[0]))
            hsize = int((float(img.size[1])*float(wpercent)))
            img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)

            filename_end = file[len(file)-4:len(file)]
            if mode == "2":
                # Removes anything that comes after an underscore
                iconname = file.lower().split("_")[0]
            elif mode == "3":
                # Removes anything that comes before an underscore
                iconname = file.lower().split("_")[1].split(".")[0]
            else:
                iconname = file.replace(" ", "_")[0:len(file)-4].lower()

            t_filename = iconname + "_t" + filename_end
            b_filename = iconname + "_b" + filename_end

            img.save("output/" + t_filename, **png_info)

            shutil.copy2("input/" + file, "output/" + b_filename)

            print("Converted " + file + "..")
    print("Converting finished, now move the content of the output-folder to icons/gamename.")

except Exception as e:
    print("Error! Have you created the folders and activated virtualenv?", e)
